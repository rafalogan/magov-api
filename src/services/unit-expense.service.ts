import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';

import { IServiceOptions, IUnitExpenseModel, IUnitExpensePayment } from 'src/repositories/types';
import { DatabaseService } from './abistract-database.service';
import { ReadOptionsModel, UnitExpenseModel, UnitExpenseViewModel } from 'src/repositories/models';
import { convertDataValues, convertToDate, existsOrError, isRequired } from 'src/utils';
import { FileEntity, UnitExpense, UnitExpensePayment } from 'src/repositories/entities';

export class UnitExpenseService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: UnitExpenseModel) {
		try {
			const toSave = new UnitExpense({ ...data, active: true } as IUnitExpenseModel);
			const [id] = await this.db('units_expenses').insert(convertDataValues(toSave));

			existsOrError(Number(id), { message: 'Internal error', error: id, status: INTERNAL_SERVER_ERROR });
			const payments = data.payments ? await this.setPayments(data.payments, id) : undefined;
			const invoice = await this.setInvoiceFile(data.invoice, id);

			return { message: 'Unit Expense successfully created', data: { ...data, payments, invoice, id } };
		} catch (err) {
			return err;
		}
	}

	async update(data: UnitExpenseModel, id: number) {
		try {
			const fromDB = (await this.getExpense(id, data.tenancyId)) as UnitExpenseViewModel;

			existsOrError(fromDB?.id, fromDB);
			const toUpdate = new UnitExpense({ ...fromDB, ...data, tenancyId: fromDB.tenancyId } as IUnitExpenseModel);

			await this.db('units_expenses').where({ id }).andWhere('tenancy_id', fromDB.tenancyId).update(convertDataValues(toUpdate));
			const payments = data.payments?.length ? await this.setPayments(data.payments, id) : data.payments;
			const invoice = data.invoice ? await this.setInvoiceFile(data.invoice, id) : undefined;

			return { message: 'Unit Expense successfully updated', data: { ...fromDB, ...data, payments, invoice } };
		} catch (err) {
			return err;
		}
	}

	async read(options: ReadOptionsModel, id?: number) {
		try {
			const { tenancyId, unitId } = options;
			existsOrError(tenancyId, { message: isRequired('tenancyId'), status: BAD_REQUEST });

			if (id) return this.getExpense(id, tenancyId as number);
			if (unitId) return this.getExpensesPerUnit(unitId, tenancyId as number);

			const expenses = await this.db('units_expenses').select('id', 'expense', 'description', 'due_date').where('tenancy_id', tenancyId);
			existsOrError(Array.isArray(expenses), { message: 'Internal error', error: expenses, status: INTERNAL_SERVER_ERROR });

			return expenses.map(i => convertDataValues({ ...i, due_date: convertToDate(i.due_date) }, 'camel'));
		} catch (err) {
			return err;
		}
	}

	async getExpensesPerUnit(unitId: number, tenancyId: number) {
		return this.db('units_expenses')
			.select('id', 'expense', 'description', 'due_date')
			.where('unit_id', unitId)
			.andWhere('tenancy_id', tenancyId)
			.then(res => {
				existsOrError(Array.isArray(res), { message: 'Internal error', error: res, status: INTERNAL_SERVER_ERROR });
				return res.map(i => convertDataValues({ ...i, due_date: convertToDate(i.due_date) }, 'camel'));
			})
			.catch(err => err);
	}

	async getExpense(id: number, tenancyId: number) {
		try {
			const fromDB = await this.db({ ue: 'units_expenses', f: 'files' })
				.select(
					{
						id: 'ue.id',
						expense: 'ue.expense',
						description: 'ue.description',
						due_date: 'ue.due_date',
						amount: 'ue.amount',
						active: 'ue.active',
						unit_id: 'ue.unit_id',
						tenancy_id: 'ue.tenancy_id',
						supplier_id: 'ue.supplier_id',
						expense_type_id: 'ue.expense_type_id',
						task_id: 'ue.task_id',
					},
					{
						title: 'f.title',
						alt: 'f.alt',
						name: 'f.name',
						filename: 'f.filename',
						type: 'f.type',
						url: 'f.url',
					}
				)
				.where({ id })
				.andWhere('tenancy_id', tenancyId)
				.andWhereRaw('f.unit_expense_id = ue.id')
				.first();

			existsOrError(fromDB?.id, { message: 'expense not found', status: NOT_FOUND });
			const raw = convertDataValues(fromDB, 'camel');
			const type = raw.expanseTypeId ? await this.getData('expenses_types', raw.expanseTypeId, raw.tenancyId) : undefined;
			const supplier = raw.supplierId ? await this.getData('suppliers', raw.supplierId, raw.tenancyId) : undefined;
			const task = raw.taskId ? await this.getData('tasks', raw.taskId, raw.tenancyId) : undefined;
			const payments = await this.getPayments(raw.id);

			return new UnitExpenseViewModel({ ...raw, type, supplier, task, payments, invoice: { ...raw } });
		} catch (err) {
			return err;
		}
	}

	async disable(id: number, tenancyId: number) {
		try {
			const fromDB = await this.db('units_expenses').where({ id }).andWhere('tenancy_id', tenancyId).first();
			existsOrError(fromDB.id, { message: 'Expense Not found', status: NOT_FOUND });
			const toDesabled = new UnitExpense({ ...convertDataValues(fromDB, 'camel'), active: false });

			await this.db('units_expenses').where({ id }).andWhere('tenancy_id', tenancyId).update(convertDataValues(toDesabled));
			return { message: 'Expense successfully disabled', data: toDesabled };
		} catch (err) {
			return err;
		}
	}

	private async getData(tableName: string, id: number, tenancyId: number) {
		return this.db(tableName)
			.where({ id })
			.andWhere('tenancy_id', tenancyId)
			.first()
			.then(res => {
				existsOrError(res.id, { message: 'Type expense not found', status: NOT_FOUND });
				return convertDataValues(res, 'camel');
			})
			.catch(err => err);
	}

	private async getPayments(id: number) {
		return this.db({ uep: 'units_expenses_payments', p: 'payments' })
			.select(
				{
					value: 'uep.value',
					installments: 'uep.installments',
				},
				{ payment_form: 'p,from' }
			)
			.where('uep.unit_expense_id', id)
			.andWhereRaw('p.id = uep.payment_id')
			.then(res => {
				if (!Array.isArray(res)) return [];
				return res.map(i => convertDataValues(i, 'camel'));
			});
	}

	private async setPayments(data: IUnitExpensePayment[], unitExpenseId: number) {
		try {
			const res = [];
			for (const item of data) {
				const fromDB = await this.db('units_expenses_payments')
					.where('payment_id', item.paymentId)
					.andWhere('unit_expense_id', unitExpenseId)
					.first();

				if (fromDB.id) {
					const toUpdate = new UnitExpensePayment({ ...convertDataValues(fromDB, 'camel'), ...data });
					await this.db('units_expenses_payments')
						.where('payment_id', item.paymentId)
						.andWhere('unit_expense_id', unitExpenseId)
						.update(convertDataValues(toUpdate));
					res.push(toUpdate);
				} else {
					const toSave = new UnitExpensePayment({ ...item, unitExpenseId });
					await this.db('units_expenses_payments').insert(convertDataValues(toSave));
					res.push(toSave);
				}
			}

			return res;
		} catch (err) {
			return err;
		}
	}

	private async setInvoiceFile(data: FileEntity, unitExpenseId: number) {
		try {
			const fromDB = await this.db('files').where('unit_expense_id', unitExpenseId).first();

			if (fromDB?.id) {
				const toUpdate = new FileEntity({ ...convertDataValues(fromDB, 'camel'), ...data });
				await this.db('files')
					.where('unit_expense_id', unitExpenseId)
					.update(convertDataValues({ ...toUpdate, unitExpenseId }));
				return { ...toUpdate, unitExpenseId };
			}
			const [id] = await this.db('files').insert(convertDataValues({ ...data, unitExpenseId }));

			return { ...data, unitExpenseId, id };
		} catch (err) {
			return err;
		}
	}
}
