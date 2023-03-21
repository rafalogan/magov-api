import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';

import { IServiceOptions } from 'src/repositories/types';
import { DatabaseService } from './abistract-database.service';
import { GovernmentExpensesModel, ReadOptionsModel } from 'src/repositories/models';
import { convertDataValues, existsOrError, isRequired, notExistisOrError, setValueNumberToView } from 'src/utils';
import { GovernmentExpenses } from 'src/repositories/entities';

export class GovernmentExpensesService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: GovernmentExpensesModel) {
		try {
			const fromDB = (await this.getExpense(data.expense, data.tenancyId)) as GovernmentExpensesModel;
			notExistisOrError(fromDB?.id, fromDB);
			const toSave = new GovernmentExpenses({ ...data, active: true });
			const [id] = await this.db('government_expenses').insert(convertDataValues(toSave));

			return { message: 'Government Expense successfully saved', data: { ...toSave, id } };
		} catch (err) {
			return err;
		}
	}

	async update(data: GovernmentExpensesModel, id: number) {
		try {
			const fromDB = (await this.getExpense(id, data.tenancyId)) as GovernmentExpenses;
			existsOrError(fromDB?.id, fromDB);
			const toUpdate = new GovernmentExpenses({ ...fromDB, ...data, tenancyId: fromDB.tenancyId });
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
			const res = await this.db('government_expenses').select('id', 'expense', 'due_date', 'value').where('tenancy_id', tenancyId);
			existsOrError(Array.isArray(res), { message: 'Internal error', status: INTERNAL_SERVER_ERROR, err: res });

			return res.map(i => {
				i.value = setValueNumberToView(i.value);
				return convertDataValues(i, 'camel');
			});
		} catch (err) {
			return err;
		}
	}
	async getExpense(filter: number | string, tenancyId: number) {
		try {
			const fromDB = await this.db('government_expenses')
				.where('id', filter)
				.andWhere('tenancy_id', tenancyId)
				.orWhere('title', filter)
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

			const toDisabled = new GovernmentExpenses({ ...fromDB, active: false });
			await this.db('government_expenses').where({ id }).andWhere('tenancy_id', tenancyId).update(convertDataValues(toDisabled));

			return { message: 'Government expense successfully disabled', data: toDisabled };
		} catch (err) {
			return err;
		}
	}
}
