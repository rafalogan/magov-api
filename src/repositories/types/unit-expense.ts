import { IID } from './shared';
import { IFile } from 'src/repositories/types/file';

export interface IUnitExpense extends IID {
	expense: string;
	description?: Blob | string;
	dueDate: Date | string;
	amount: number;
	expenseTypeId?: number;
	supplierId?: number;
	active: boolean;
	taskId?: number;
	unitId: number;
	tenancyId: number;
}

export interface IUnitExpensePayment {
	paymentId: number;
	unitExpenseId?: number;
	value: number;
	installments: number;
}

export interface IUnitExpenseModel extends IUnitExpense {
	invoice: IFile;
	payments: IUnitExpensePayment[];
}

export interface IUnitExpenseViewModel extends IID {
	expense: string;
	description?: Blob | string;
	dueDate: Date | string;
	amount: number;
	active: boolean;
	type?: string;
	supplier?: IUnitExpenseSupplier;
	task?: IUnitExpenseTask;
	unitId: number;
	tenancyId: number;
	payments: IUnitExpensePaymentModel[];
}

export interface IUnitExpensePaymentModel {
	paymentForm: string;
	value: number;
	installments: number;
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
