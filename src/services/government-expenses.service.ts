import { BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';

import { IGExpenseBudget, IGovernmentExpensesModel, IServiceOptions } from 'src/repositories/types';
import { DatabaseService } from './abistract-database.service';
import { GovernmentExpensesModel, ReadOptionsModel } from 'src/repositories/models';
import { convertBlobToString, convertDataValues, existsOrError, isRequired, notExistisOrError, setValueNumberToView } from 'src/utils';
import { GovernmentExpenses } from 'src/repositories/entities';

export class GovernmentExpensesService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: GovernmentExpensesModel) {
		try {
			const fromDB = (await this.getExpense(data.expense, data.tenancyId)) as GovernmentExpensesModel;
			notExistisOrError(fromDB?.id, fromDB);
			const toSave = new GovernmentExpenses({ ...data, active: true } as IGovernmentExpensesModel);
			const [id] = await this.db('government_expenses').insert(convertDataValues(toSave));
			const budgets = data.budgets ? await this.setBudgets(data.budgets, id, data.dueDate) : undefined;

			return { message: 'Government Expense successfully saved', data: { ...toSave, id, budgets } };
		} catch (err) {
			return err;
		}
	}

	async update(data: GovernmentExpensesModel, id: number) {
		try {
			const fromDB = (await this.getExpense(id, data.tenancyId)) as GovernmentExpenses;
			existsOrError(fromDB?.id, fromDB);
			const toUpdate = new GovernmentExpenses({ ...fromDB, ...data, tenancyId: fromDB.tenancyId } as IGovernmentExpensesModel);
			await this.db('government_expenses').update(convertDataValues(toUpdate)).where({ id }).andWhere('tenancy_id', fromDB.tenancyId);

			return { message: 'Government expense successfully updated', data: toUpdate };
		} catch (err) {
			return err;
		}
	}

	async read(options: ReadOptionsModel, id?: number) {
		try {
			const { tenancyId } = options;
			existsOrError(tenancyId, { message: isRequired('tenancyId'), status: BAD_REQUEST });

			if (id) return this.getExpense(id, tenancyId as number);
			const tables = { ge: 'government_expenses', p: 'propositions', u: 'units', t: 'types', a: 'adresses' };
			const fields = [
				{ id: 'ge.id', expense: 'ge.expense', due_date: 'ge.due_date', description: 'ge.description', value: 'ge.value' },
				{ title: 'p.title', menu: 'p.menu' },
				{ type: 't.name' },
				{ unit: 'u.name' },
				{ city: 'a.city', uf: 'a.uf' },
			];
			const res = await this.db(tables)
				.select(...fields)
				.where('ge.tenancy_id', tenancyId)
				.andWhereRaw('p.id = ge.proposition_id')
				.andWhereRaw('t.id = p.type_id')
				.andWhereRaw('u.id = p.unit_id')
				.andWhereRaw('a.unit_id = p.unit_id');
			existsOrError(Array.isArray(res), { message: 'Internal error', status: INTERNAL_SERVER_ERROR, err: res });

			const data: any[] = [];

			for (const item of res) {
				const reserve = (await this.getBudgets(item.id)) as any;
				const description = convertBlobToString(item.description);
				const menu = convertBlobToString(item.menu);
				const balance = reserve?.map((i: any) => i.value).reduce((total: number, value: number) => total + value, 0) - item.value;

				data.push({ ...convertDataValues(item, 'camel'), description, menu, reserve, balance });
			}

			return data;
		} catch (err) {
			return err;
		}
	}
	async getExpense(filter: number | string, tenancyId: number) {
		try {
			const fromDB = await this.db('government_expenses')
				.where('id', filter)
				.andWhere('tenancy_id', tenancyId)
				.orWhere('expense', filter)
				.first();

			existsOrError(fromDB, { message: 'Expense Not Found', status: NOT_FOUND });
			existsOrError(fromDB?.id, { message: 'Internal', error: fromDB, status: INTERNAL_SERVER_ERROR });
			const raw = convertDataValues(fromDB, 'camel');
			const proposition = raw.propositionId
				? await this.db('propositions').where({ id: raw.propositionId }).select('id', 'title').first()
				: undefined;
			const task = raw.taskId ? await this.db('tasks').select('id', 'title').where({ id: raw.taskId }).first() : undefined;

			return new GovernmentExpensesModel({ ...raw, proposition, task });
		} catch (err) {
			return err;
		}
	}

	async disabled(id: number, tenancyId: number) {
		try {
			const fromDB = (await this.getExpense(id, tenancyId)) as GovernmentExpensesModel;
			existsOrError(fromDB?.id, fromDB);
			existsOrError(fromDB.active, { message: 'Expense already disabled', status: FORBIDDEN });

			const toDisabled = new GovernmentExpenses({ ...fromDB, active: false } as IGovernmentExpensesModel);
			await this.db('government_expenses').where({ id }).andWhere('tenancy_id', tenancyId).update(convertDataValues(toDisabled));

			return { message: 'Government expense successfully disabled', data: toDisabled };
		} catch (err) {
			return err;
		}
	}

	private async setBudgets(budgets: IGExpenseBudget[], governmentExpanseId: number, date: Date) {
		try {
			const res: any[] = [];
			for (const item of budgets) {
				const revenue = await this.db('revenues').where({ id: item.id }).first();
				const { id: revenueId, value } = revenue;
				const toSave = { governmentExpanseId, revenueId, value, date };

				await this.db('government_expenses_payment').insert(convertDataValues(toSave));

				res.push(toSave);
			}

			return res;
		} catch (err) {
			return err;
		}
	}

	private async getBudgets(expenseId: number) {
		try {
			const tables = { gep: 'government_expenses_payment', r: 'revenues' };
			const fields = [{ date: 'gep.date', value: 'gep.value' }, { revenue: 'r.revenue' }];
			const fromDB = await this.db(tables)
				.where('gep.government_expense_id', expenseId)
				.select(...fields)
				.andWhereRaw('r.id = gep.revenue_id');
			existsOrError(Array.isArray(fromDB), { message: 'intenal error', err: fromDB, status: INTERNAL_SERVER_ERROR });

			return fromDB?.map(i => convertDataValues(i, 'camel'));
		} catch (err) {
			return err;
		}
	}
}
