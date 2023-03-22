import { convertBlobToString, convertToDate, setInstanceId } from 'src/utils';
import { IUnitExpenseModel } from '../types';

export class UnitExpense {
	id?: number;
	expense: string;
	description?: string;
	dueDate: Date;
	amount: number;
	active: boolean;
	supplierId?: number;
	expenseTypeId?: number;
	taskId?: number;
	unitId: number;
	tenancyId: number;

	constructor(data: IUnitExpenseModel, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.expense = data.expense?.trim();
		this.description = convertBlobToString(data.description);
		this.dueDate = convertToDate(data.dueDate);
		this.amount = Number(data.amount) || 1;
		this.active = !!data.active;
		this.supplierId = setInstanceId(data.supplierId);
		this.expenseTypeId = setInstanceId(data.expenseTypeId);
		this.taskId = setInstanceId(data.taskId);
		this.unitId = Number(data.unitId);
		this.tenancyId = Number(data.tenancyId);
	}
}
