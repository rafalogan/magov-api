import { setInstanceId, setValueNumberToDadaBase } from 'src/utils';
import { IUnitExpensePayment } from '../types';

export class UnitExpensePayment {
	paymentId: number;
	unitExpenseId?: number;
	value: number;
	installments: number;

	constructor(data: IUnitExpensePayment) {
		this.paymentId = Number(data.paymentId);
		this.unitExpenseId = setInstanceId(data.unitExpenseId);
		this.value = setValueNumberToDadaBase(data.value) as number;
		this.installments = Number(data.installments) || 1;
	}
}
