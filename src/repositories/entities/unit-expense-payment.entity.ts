import { setInstanceId, setValueNumberToDadaBase } from 'src/utils';
import { IUnitExpensePayment } from '../types';

export class UnitExpensePayment {
	paymentId?: number;
	paymentForm?: string;
	unitExpenseId?: number;
	value: number;
	installments: number;

	constructor(data: IUnitExpensePayment) {
		this.paymentId = setInstanceId(data.paymentId);
		this.paymentForm = data.paymentForm?.trim();
		this.unitExpenseId = setInstanceId(data.unitExpenseId);
		this.value = setValueNumberToDadaBase(data.value) as number;
		this.installments = Number(data.installments) || 1;
	}
}
