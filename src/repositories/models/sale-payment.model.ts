import { convertToDate, setInstanceId } from 'src/utils';
import { ISalePayment } from '../types';

export class SalePaymentModel {
	id?: number;
	payDate: Date;
	value: number;
	commission: boolean;
	saleId: number;
	type: string;
	installment: number;

	constructor(data: ISalePayment, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.payDate = convertToDate(data.payDate);
		this.value = Number(data.value);
		this.commission = !!data.commission;
		this.saleId = Number(data.saleId);
		this.type = data.type?.trim();
		this.installment = Number(data.installment);
	}
}
