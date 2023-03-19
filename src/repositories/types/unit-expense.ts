import { IID } from './shared';

export interface IUnitExpense extends IID {
	expense: string;
	description?: Blob | string;
	dueDate: Date | string;
	amount: number;
	value: number;
	installments: number;
	expensesTypeId?: number;
	supplierId?: number;
	taskId?: number;
	paymentId?: number;
	propositionId?: number;
	damanId?: number;
	unitId: number;
	tenancyId: number;
}

export interface IUnitExpenseModel extends IID {
	expense: string;
	description?: Blob | string;
	dueDate: Date | string;
	amount: number;
	value: number;
	installments: number;
	type?: string;
	supplier?: IUnitExpenseSupplier;
	task?: IUnitExpenseTask;
	unitId: number;
	tenancyId: number;
}

export interface IUnitExpenseSupplier extends IID {
	name?: string;
}

export interface IUnitExpenseTask extends IID {
	title: string;
}

export interface IUnitDemand extends IID {
	name: string;
}
