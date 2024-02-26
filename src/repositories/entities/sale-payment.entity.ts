import { convertToDate, setInstanceId, setValueNumberToDadaBase } from 'src/utils';
import { ISalePayment } from '../types';

export class SalePayment {
	id?: number;
	payDate: Date;
	installment: number;
	type: string;
	value: number;
	commission: boolean;
	saleId: number;

	constructor(data: ISalePayment, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.payDate = convertToDate(data.payDate);
		this.installment = Number(data.installment);
		this.type = data.type?.trim();
		this.value = setValueNumberToDadaBase(data.value) as number;
		this.commission = !!data.commission;
		this.saleId = Number(data.saleId);
	}
}