import { BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';
import { onLog } from 'src/core/handlers';
import { Revenue, Origin } from 'src/repositories/entities';
import { ReadOptionsModel, RevenueModel } from 'src/repositories/models';
import { IRevenueModel, IServiceOptions } from 'src/repositories/types';
import { convertDataValues, deleteFile, equalsOrError, existsOrError, isRequired, notExistisOrError } from 'src/utils';
import { DatabaseService } from './abistract-database.service';

export class RevenueService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: RevenueModel) {
		try {
			const fromDB = (await this.getRevenue(data.revenue, data.tenancyId)) as RevenueModel;

			notExistisOrError(fromDB.id, { message: 'Revenue already exists', status: FORBIDDEN });
			const originId = await this.setOriginId(data.origin);

			existsOrError(Number(originId), { message: 'Internal Error', error: originId, status: INTERNAL_SERVER_ERROR });
			onLog('data', data);
			const toSave = new Revenue({ ...data, originId } as IRevenueModel);
			const [id] = await this.db('revenues').insert(convertDataValues(toSave));
			if (data.document) await this.db('files').insert(convertDataValues({ ...data.document, revenueId: id }));
			existsOrError(Number(id), { message: 'Internal Error', error: id, status: INTERNAL_SERVER_ERROR });

			return { message: 'Revenue saved with succsess', data: { ...data, id, origin: { ...data.origin, id: originId } } };
		} catch (err) {
			return err;
		}
	}

	async update(data: RevenueModel, id: number) {
		try {
			const fromDB = (await this.getRevenue(id, data.tenancyId)) as RevenueModel;

			existsOrError(fromDB.id, { message: 'Revenue not found', status: NOT_FOUND });
			equalsOrError(fromDB.tenancyId, data.tenancyId, { message: 'user forbidden', status: FORBIDDEN });
			let originId = fromDB.origin.id;
			if (data.document) {
				await this.deleteFileRevenue(fromDB.document?.filename as string);
				await this.db('files').insert(convertDataValues({ ...data.document, revenueId: fromDB.id }));
			}

			if (data.origin) originId = await this.setOriginId(data.origin);

			const toUpdate = new Revenue({ ...fromDB, ...data, tenancyId: fromDB.tenancyId, originId } as IRevenueModel);
			await this.db('revenues').where({ id }).update(convertDataValues(toUpdate));

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

			return this.db({ r: 'revenues', o: 'origins', f: 'files' })
				.select(
					{ id: 'r.id', revenue: 'r.revenue', active: 'r.active', value: 'r.value' },
					{ origin: 'o.origin' },
					{ document_url: 'f.url' }
				)
				.where('r.tenancy_id', tenancyId)
				.andWhereRaw('o.id = r.origin_id')
				.andWhereRaw('f.revenue_id = r.id')
				.then(res => {
					existsOrError(Array.isArray(res), { message: 'Internal error', error: res, status: INTERNAL_SERVER_ERROR });

					return res.map(i => {
						i.value = i.value / 100;
						return convertDataValues(i, 'camel');
					});
				})
				.catch(err => err);
		} catch (err) {
			return err;
		}
	}

	async getRevenue(value: number | string, tenancyId: number) {
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
				.where('r.id', value)
				.andWhere('r.tenancy_id', tenancyId)
				.andWhereRaw('o.id = r.origin_id')
				.andWhereRaw('f.revenue_id = r.id')
				.andWhereRaw('u.id = r.unit_id')
				.orWhere('r.revenue', value)
				.first();

			existsOrError(fromDB.id, { message: 'Revenue not found', status: NOT_FOUND });

			return new RevenueModel(
				convertDataValues(
					{
						...fromDB,
						origin: { id: fromDB.origin_id, origin: fromDB.origin },
						document: { ...fromDB, title: fromDB.file_title, alt: fromDB.file_alt, id: undefined },
					},
					'camel'
				)
			);
		} catch (err) {
			return err;
		}
	}

	async disabled(id: number, tenancyId: number) {
		try {
			const revenue = await this.db('revenues').where({ id }).andWhere('tenancy_id', tenancyId).first();
			existsOrError(revenue.id, { message: 'Not Found', status: NOT_FOUND });

			const toDisable = new Revenue(convertDataValues({ ...revenue, active: false }, 'camel'));

			await this.db('revenues').where({ id }).update(convertDataValues(toDisable));

			return { message: 'Revenue disabled with succsess', data: toDisable };
		} catch (err) {
			return err;
		}
	}

	private async setOriginId(value: Origin) {
		try {
			if (value.id) return value.id;

			const origin = await this.db('origins').where({ origin: value.origin }).first();
			onLog('GET Origin', origin);
			if (origin?.id) return origin.id;

			const [id] = await this.db('origins').insert(convertDataValues(value));
			existsOrError(Number(id), { message: 'Internal Error', error: id, status: INTERNAL_SERVER_ERROR });

			return Number(id);
		} catch (err) {
			return err;
		}
	}

	private async deleteFileRevenue(filename: string) {
		try {
			const fromDB = await this.db('files').where({ filename }).first();

			if (fromDB.id) await this.db('files').where({ filename }).del();
			return deleteFile(filename);
		} catch (err) {
			return err;
		}
	}
}
