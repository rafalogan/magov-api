import { IID } from './shared';

export interface IUnitExpense extends IID {
	expense: string;
	description?: Blob | string;
	dueDate: Date | string;
	amount: number;
	value: number;
	installments: number;
	supplierId?: number;
	taskId?: number;
	paymentId?: number;
	unitId: number;
	tenancyId: number;
}
