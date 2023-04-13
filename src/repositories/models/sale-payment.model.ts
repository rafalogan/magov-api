import { convertToDate, setInstanceId, setValueNumberToView } from 'src/utils';
import { ISalePayment } from '../types';

export class SalePaymentModel {
	id?: number;
	payDate: Date;
	value: number;
	commission: boolean;
	saleId: number;

	constructor(data: ISalePayment, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.payDate = convertToDate(data.payDate);
		this.value = setValueNumberToView(data.value) as number;
		this.commission = !!data.commission;
		this.saleId = Number(data.saleId);
	}
}
