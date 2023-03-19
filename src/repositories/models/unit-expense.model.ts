import { IUnitExpenseModel, IUnitExpensePayment } from 'src/repositories/types';
import { convertBlobToString, convertToDate, setInstanceId } from 'src/utils';
import { FileEntity, UnitExpensePayment } from '../entities';

export class UnitExpenseModel {
	id?: number;
	expense: string;
	description?: string;
	dueDate: Date;
	amount: number;
	active?: boolean;
	expenseTypeId?: number;
	supplierId?: number;
	taskId?: number;
	unitId: number;
	tenancyId: number;
	invoice: FileEntity;
	payments?: UnitExpensePayment[];

	constructor(data: IUnitExpenseModel, id: number) {
		this.id = setInstanceId(id || data.id);
		this.expense = data.expense;
		this.description = convertBlobToString(data.description);
		this.dueDate = convertToDate(data.dueDate);
		this.amount = Number(data.amount);
		this.expenseTypeId = setInstanceId(data.expenseTypeId);
		this.active = data.active || undefined;
		this.supplierId = setInstanceId(data.supplierId);
		this.taskId = setInstanceId(data.taskId);
		this.unitId = Number(data.unitId);
		this.tenancyId = Number(data.tenancyId);
		this.invoice = new FileEntity(data.invoice);
		this.payments = this.setPayments(data.payments);
	}

	private setPayments(data?: IUnitExpensePayment[]) {
		if (!data) return undefined;

		return data.map(i => new UnitExpensePayment({ ...i, unitExpenseId: this.id }));
	}
}
