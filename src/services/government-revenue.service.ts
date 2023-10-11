import { Request } from 'express';
import { BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';

import { GovernmentRevenueModel, GovernmentRevenueViewModel, ReadOptionsModel } from 'src/repositories/models';
import { IPropositionExpensesGovernment, IRevenueModel, IServiceOptions } from 'src/repositories/types';
import { DatabaseService } from './abistract-database.service';
import { convertDataValues, existsOrError, isRequired, notExistisOrError } from 'src/utils';
import { Revenue } from 'src/repositories/entities';
import { getUserLogData, onError, onLog } from 'src/core/handlers';

export class GovernmentRevenueService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: GovernmentRevenueModel, req: Request) {
		try {
			const fromDB = (await this.getGovRevenue(data.revenue, data.tenancyId)) as GovernmentRevenueViewModel;

			onLog('fromDB to save', fromDB);
			notExistisOrError(fromDB?.id, { message: 'Revenue already exists', status: FORBIDDEN });

			const originId = (await this.getTypeOfRecipe(data.origin)) as number;

			onLog('origin id', originId);
			existsOrError(Number(originId), originId);

			const toSave = new Revenue({
				...data,
				originId,
				government: true,
			} as IRevenueModel);
			const [id] = await this.db('revenues').insert(convertDataValues({ ...toSave, government: true }));
			existsOrError(Number(id), { message: 'Internal error', err: id, status: INTERNAL_SERVER_ERROR });

			if (data.expenses?.length) await this.setPropositionOfRevenue(data.expenses, id);
			await this.userLogService.create(getUserLogData(req, 'revenues', id, 'salvar'));

			return { message: 'Revenue saved successfully.', data: { ...data, id } };
		} catch (err) {
			return err;
		}
	}

	async update(data: GovernmentRevenueModel, id: number, req: Request) {
		try {
			const fromDB = (await this.getGovRevenue(id, data.tenancyId)) as GovernmentRevenueViewModel;
			existsOrError(fromDB?.id, fromDB);

			if (data.expenses.length) await this.setPropositionOfRevenue(data.expenses, id);

			const originId = await this.getTypeOfRecipe(data.origin || fromDB.origin);
			const toUpdate = new Revenue(
				{
					...fromDB,
					...data,
					originId,
					unit: fromDB.unit.unit,
					tenancyId: fromDB.tenancyId,
					government: true,
				} as IRevenueModel,
				id
			);

			await this.db('revenues').update(convertDataValues(toUpdate)).where({ id }).andWhere('tenancy_id', fromDB.tenancyId);
			await this.userLogService.create(getUserLogData(req, 'revenues', id, 'atualizar'));

			return { message: 'Revenue updated successfully', data: { ...toUpdate, expenses: data.expenses } };
		} catch (err) {
			return err;
		}
	}

	async read(options: ReadOptionsModel, id?: number) {
		try {
			const { tenancyId } = options;
			existsOrError(tenancyId, { message: isRequired('tenancyId'), status: BAD_REQUEST });

			if (id) return this.getGovRevenue(id, tenancyId as number);

			return this.getGovernmentRevenues(tenancyId as number);
		} catch (err) {
			return err;
		}
	}

	async getGovernmentRevenues(tenancyId: number) {
		try {
			const tables = { r: 'revenues', o: 'origins', u: 'units', a: 'adresses' };
			const fields = [
				{
					id: 'r.id',
					revenue: 'r.revenue',
					receive: 'r.receive',
					description: 'r.description',
					status: 'r.status',
					active: 'r.active',
					recurrent: 'r.recurrent',
					document_number: 'r.document_number',
					value: 'r.value',
					tenancy_id: 'r.tenancy_id',
				},
				{ origin: 'o.origin' },
				{ unit_id: 'u.id', unit: 'u.name' },
				{ city: 'a.city', uf: 'a.uf' },
			];

			const fromDB = await this.db(tables)
				.select(...fields)
				.where('r.tenancy_id', tenancyId)
				.andWhere('r.government', true)
				.andWhereRaw('o.id = r.origin_id')
				.andWhereRaw('u.id = r.unit_id')
				.andWhereRaw('a.unit_id = r.unit_id')
				.orderBy('r.receive', 'desc');

			onLog('fromDb list', fromDB);

			existsOrError(Array.isArray(fromDB), { message: 'Internal error', err: fromDB, status: INTERNAL_SERVER_ERROR });

			const res: any[] = [];
			for (const item of fromDB) {
				const raw = convertDataValues(item, 'camel');
				const expenses = await this.getPropositionOfRevenue(raw.id);
				const unit = { id: raw.unitId, unit: raw.unit };
				const region = `${raw.city}-${raw.uf}`;
				const balance = await this.getBalance(Number(item?.id), Number(item?.value));

				res.push(new GovernmentRevenueViewModel({ ...raw, unit, expenses, region, balance }));
			}
			onLog('response', res);

			return res;
		} catch (err) {
			return err;
		}
	}

	async getGovRevenue(filter: number | string, tenancyId: number) {
		try {
			const tables = { r: 'revenues', o: 'origins', u: 'units', a: 'adresses' };
			const fields = [
				{
					id: 'r.id',
					revenue: 'r.revenue',
					receive: 'r.receive',
					description: 'r.description',
					status: 'r.status',
					active: 'r.active',
					document_number: 'r.document_number',
					recurrent: 'r.recurrent',
					value: 'r.value',
					tenancy_id: 'r.tenancy_id',
				},
				{ origin: 'o.origin' },
				{ unit_id: 'u.id', unit: 'u.name' },
				{ city: 'a.city', uf: 'a.uf' },
			];
			const fromDB =
				typeof filter === 'number'
					? await this.db(tables)
							.select(...fields)
							.where('r.id', filter)
							.andWhere('r.tenancy_id', tenancyId)
							.andWhereRaw('u.id = r.unit_id')
							.andWhereRaw('o.id = r.origin_id')
							.andWhereRaw('a.unit_id = r.unit_id')
							.first()
					: await this.db(tables)
							.select(...fields)
							.where('r.revenue', filter)
							.andWhere('r.tenancy_id', tenancyId)
							.andWhereRaw('u.id = r.unit_id')
							.andWhereRaw('o.id = r.origin_id')
							.andWhereRaw('a.unit_id = r.unit_id')
							.first();

			existsOrError(fromDB, { message: 'Revenue not found', status: NOT_FOUND });
			notExistisOrError(fromDB.severity === 'ERROR', {
				message: 'Internal error',
				status: INTERNAL_SERVER_ERROR,
				err: fromDB,
			});

			onLog('fromDB on getGoveRevenue', convertDataValues(fromDB, 'camel'));

			const propositions = await this.getPropositionOfRevenue(fromDB.id);
			const unit = { id: fromDB.unit_id, unit: fromDB.unit };
			const type = { id: fromDB.type_id, typeOfRecipe: fromDB.type_of_recipe };
			const region = `${fromDB.city}-${fromDB.uf}`;
			const balance = await this.getBalance(Number(fromDB?.id), Number(fromDB?.value));

			return new GovernmentRevenueViewModel({ ...convertDataValues(fromDB, 'camel'), unit, type, propositions, region, balance });
		} catch (err) {
			return err;
		}
	}

	async disebled(id: number, tenancyId: number, req: Request) {
		try {
			const fromDB = (await this.getGovRevenue(id, tenancyId)) as GovernmentRevenueViewModel;
			existsOrError(fromDB?.id, fromDB);
			existsOrError(fromDB.active, { message: 'Revenue already disabled', status: FORBIDDEN });

			await this.db('revenues').where({ id }).andWhere('tenancy_id', tenancyId).update({ active: false });
			await this.userLogService.create(getUserLogData(req, 'revenues', id, 'desabilitar'));

			return { message: 'Revenue successfully disabled', data: { ...fromDB, active: false } };
		} catch (err) {
			return err;
		}
	}

	private async getBalance(revenueId: number, revenueValue: number) {
		try {
			const GEPayDB = await this.db('government_expenses_payment').select('value').where('revenue_id', revenueId);
			existsOrError(Array.isArray(GEPayDB), { message: 'Internal Error', err: GEPayDB, status: INTERNAL_SERVER_ERROR });

			const expenses = GEPayDB.map(({ value }) => Number(value)).reduce((total: number, value: number) => total + value, 0) || 0;

			return revenueValue - expenses;
		} catch (err: any) {
			onError('erro to get balance', err);
			return err;
		}
	}

	private async setPropositionOfRevenue(propositions: IPropositionExpensesGovernment[], revenueId: number) {
		try {
			for (const expense of propositions) {
				const fromDB = await this.db('government_expenses_payment')
					.where('government_expense_id', expense.id)
					.andWhere('revenue_id', revenueId)
					.first();

				if (!fromDB) {
					const toSave = { governmentExpenseId: expense.id, revenueId, value: expense.reserveValue, date: new Date() };
					await this.db('government_expenses_payment').insert(convertDataValues(toSave));
				}
			}
		} catch (err) {
			return err;
		}
	}

	private async getTypeOfRecipe(origin: string) {
		try {
			const fromDB = await this.db('origins').where({ origin }).first();
			notExistisOrError(fromDB?.severity === 'ERROR', {
				message: 'Internal error',
				err: fromDB,
				status: INTERNAL_SERVER_ERROR,
			});

			if (fromDB?.id) return Number(fromDB.id);

			const [id] = await this.db('origins').insert({ origin, government: true });
			existsOrError(Number(id), { message: 'Internal error', err: id, status: INTERNAL_SERVER_ERROR });

			return Number(id);
		} catch (err) {
			return err;
		}
	}

	private async getPropositionOfRevenue(revenueId: number) {
		try {
			const tables = { ge: 'government_expenses', gep: 'government_expenses_payment' };
			const fields = [
				{ reserve_value: 'gep.value', date: 'gep.date' },
				{
					id: 'ge.id',
					name: 'ge.expense',
					expense: 'ge.value',
				},
			];
			const expanses = await this.db(tables)
				.select(...fields)
				.where('revenue_id', revenueId)
				.andWhereRaw('ge.id = gep.government_expense_id')
				.orderBy('gep.date', 'desc');

			existsOrError(Array.isArray(expanses), {
				message: 'Internal error',
				err: expanses,
				status: INTERNAL_SERVER_ERROR,
			});

			return expanses?.map(i => convertDataValues(i, 'camel'));
		} catch (err) {
			return err;
		}
	}
}
