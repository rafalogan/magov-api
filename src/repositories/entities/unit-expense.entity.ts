import { convertBlobToString, convertToDate, setInstanceId, setValueNumberToDadaBase } from 'src/utils';
import { IUnitExpense } from '../types';

export class UnitExpense {
	id?: number;
	expense: string;
	description?: string;
	dueDate: Date;
	amount: number;
	value: number;
	installments: number;
	supplierId?: number;
	taskId?: number;
	paymentId?: number;
	unitId: number;
	tenancyId: number;

	constructor(data: IUnitExpense, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.expense = data.expense.trim();
		this.description = convertBlobToString(data.description);
		this.dueDate = convertToDate(data.dueDate);
		this.amount = Number(data.amount) || 1;
		this.value = setValueNumberToDadaBase(data.value) as number;
		this.installments = data.installments;
		this.supplierId = setInstanceId(data.supplierId);
		this.taskId = setInstanceId(data.taskId);
		this.paymentId = setInstanceId(data.paymentId);
		this.unitId = Number(data.unitId);
		this.tenancyId = Number(data.tenancyId);
	}
}
