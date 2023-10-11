import { Request } from 'express';
import { BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';

import { getUserLogData, onError, onLog } from 'src/core/handlers';
import { Revenue, Origin } from 'src/repositories/entities';
import { ReadOptionsModel, RevenueModel } from 'src/repositories/models';
import { IRevenueModel, IServiceOptions } from 'src/repositories/types';
import {
	convertDataValues,
	deleteFile,
	equalsOrError,
	existsOrError,
	isRequired,
	notExistisOrError,
	setValueNumberToView,
} from 'src/utils';
import { DatabaseService } from './abistract-database.service';

export class RevenueService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: RevenueModel, req: Request) {
		try {
			const fromDB = (await this.getRevenue(data.revenue, data.tenancyId)) as RevenueModel;

			notExistisOrError(fromDB.id, { message: 'Revenue already exists', status: FORBIDDEN });
			const originId = await this.setOriginId(data.origin, req);

			existsOrError(Number(originId), { message: 'Internal Error', error: originId, status: INTERNAL_SERVER_ERROR });
			onLog('data', data);
			const toSave = new Revenue({ ...data, originId } as IRevenueModel);
			const [id] = await this.db('revenues').insert(convertDataValues(toSave));

			if (data.document) await this.db('files').insert(convertDataValues({ ...data.document, revenueId: id }));
			existsOrError(Number(id), { message: 'Internal Error', error: id, status: INTERNAL_SERVER_ERROR });
			await this.userLogService.create(getUserLogData(req, 'revenues', id, 'salvar'));

			return { message: 'Revenue saved with succsess', data: { ...data, id, origin: { ...data.origin, id: originId } } };
		} catch (err) {
			return err;
		}
	}

	async update(data: RevenueModel, id: number, req: Request) {
		try {
			const fromDB = (await this.getRevenue(id, data.tenancyId)) as RevenueModel;

			existsOrError(fromDB.id, { message: 'Revenue not found', status: NOT_FOUND });
			equalsOrError(fromDB.tenancyId, data.tenancyId, { message: 'user forbidden', status: FORBIDDEN });
			let originId = fromDB.origin.id;
			if (data.document) {
				await this.deleteFileRevenue(fromDB.document?.filename as string, req);
				await this.db('files').insert(convertDataValues({ ...data.document, revenueId: fromDB.id }));
			}

			if (data.origin) originId = await this.setOriginId(data.origin, req);

			const toUpdate = new Revenue({ ...fromDB, ...data, tenancyId: fromDB.tenancyId, originId } as IRevenueModel);
			await this.db('revenues').where({ id }).update(convertDataValues(toUpdate));
			await this.userLogService.create(getUserLogData(req, 'revenues', id, 'atualizar'));

			return { messsage: 'Revenue updated with succsess', data: toUpdate };
		} catch (err) {
			return err;
		}
	}

	async read(options: ReadOptionsModel, id?: number) {
		try {
			const { tenancyId } = options;
			existsOrError(tenancyId, { message: isRequired('tenancyId'), status: BAD_REQUEST });
			if (id) return this.getRevenue(id, Number(tenancyId));

			const fromDB = await this.db({ r: 'revenues', o: 'origins', f: 'files' })
				.select(
					{ id: 'r.id', revenue: 'r.revenue', active: 'r.active', value: 'r.value' },
					{ origin: 'o.origin' },
					{ document_url: 'f.url' }
				)
				.where('r.tenancy_id', tenancyId)
				.andWhereRaw('o.id = r.origin_id')
				.andWhereRaw('f.revenue_id = r.id');

			existsOrError(Array.isArray(fromDB), { message: 'Internal error', err: fromDB, status: INTERNAL_SERVER_ERROR });
			const res: any = [];

			for (const item of fromDB) {
				const balance = setValueNumberToView(await this.getBalance(Number(item.id), Number(item.value)));
				const value = setValueNumberToView(item.value);

				res.push(convertDataValues({ ...item, value, balance }));
			}

			return res;
		} catch (err) {
			return err;
		}
	}

	async getRevenue(filter: number | string, tenancyId: number) {
		try {
			const fromDB = await this.db({ r: 'revenues', o: 'origins', f: 'files', u: 'units' })
				.select(
					{
						id: 'r.id',
						revenue: 'r.revenue',
						receive: 'r.receive',
						description: 'r.description',
						status: 'r.status',
						active: 'r.active',
						recurrent: 'r.recurrent',
						value: 'r.value',
						tenancy_id: 'r.tenancy_id',
						unit_id: 'r.unit_id',
					},
					{ unit: 'u.name' },
					{ origin_id: 'o.id', origin: 'o.origin' },
					{
						file_title: 'f.title',
						file_alt: 'f.alt',
						name: 'f.name',
						filename: 'f.filename',
						type: 'f.type',
						url: 'f.url',
					}
				)
				.where('r.id', filter)
				.andWhere('r.tenancy_id', tenancyId)
				.andWhereRaw('o.id = r.origin_id')
				.andWhereRaw('f.revenue_id = r.id')
				.andWhereRaw('u.id = r.unit_id')
				.orWhere('r.revenue', filter)
				.first();

			existsOrError(fromDB.id, { message: 'Revenue not found', status: NOT_FOUND });
			const balance = setValueNumberToView(await this.getBalance(Number(fromDB?.id), Number(fromDB?.value)));
			const value = setValueNumberToView(fromDB?.value);

			return new RevenueModel(
				convertDataValues(
					{
						...fromDB,
						value,
						origin: { id: fromDB.origin_id, origin: fromDB.origin },
						document: { ...fromDB, title: fromDB.file_title, alt: fromDB.file_alt, id: undefined },
						balance,
					},
					'camel'
				)
			);
		} catch (err) {
			return err;
		}
	}

	async disabled(id: number, tenancyId: number, req: Request) {
		try {
			const revenue = await this.db('revenues').where({ id }).andWhere('tenancy_id', tenancyId).first();
			existsOrError(revenue.id, { message: 'Not Found', status: NOT_FOUND });

			const toDisable = new Revenue(convertDataValues({ ...revenue, active: false }, 'camel'));

			await this.db('revenues').where({ id }).update(convertDataValues(toDisable));
			await this.userLogService.create(getUserLogData(req, 'revenues', id, 'desabilitar'));

			return { message: 'Revenue disabled with succsess', data: toDisable };
		} catch (err) {
			return err;
		}
	}

	private async getBalance(revenueId: number, initialValue: number) {
		try {
			const GEPayDB = await this.db('government_expenses_payment').select('value').where('revenue_id', revenueId);
			existsOrError(Array.isArray(GEPayDB), { message: 'Internal Errror', err: GEPayDB, status: INTERNAL_SERVER_ERROR });

			const expenses = GEPayDB.map(({ value }) => Number(value)).reduce((total: number, value: number) => total + value, 0) || 0;

			return initialValue - expenses;
		} catch (err: any) {
			onError('error to getBalance', err);
			return err;
		}
	}

	private async setOriginId(value: Origin, req: Request) {
		try {
			if (value.id) return value.id;

			const origin = await this.db('origins').where({ origin: value.origin }).first();
			onLog('GET Origin', origin);
			if (origin?.id) return origin.id;

			const [id] = await this.db('origins').insert(convertDataValues(value));
			existsOrError(Number(id), { message: 'Internal Error', error: id, status: INTERNAL_SERVER_ERROR });
			await this.userLogService.create(getUserLogData(req, 'origins', id, 'salvar'));

			return Number(id);
		} catch (err) {
			return err;
		}
	}

	private async deleteFileRevenue(filename: string, req: Request) {
		try {
			const fromDB = await this.db('files').where({ filename }).first();

			if (fromDB.id) await this.db('files').where({ filename }).del();
			await this.userLogService.create(getUserLogData(req, 'files', fromDB?.id, 'deletar'));

			return deleteFile(filename);
		} catch (err) {
			return err;
		}
	}
}
