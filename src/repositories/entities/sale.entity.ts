import { convertBlobToString, convertToDate, setInstanceId, setValueNumberToDadaBase } from 'src/utils';
import { ISale } from '../types';

export class Sale {
	id?: number;
	dueDate: Date;
	value: number;
	commissionValue?: number;
	installments: number;
	description?: string;
	paymentId: number;
	unitId: number;
	tenancyId: number;
	userId: number;
	sellerId: number;

	constructor(data: ISale, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.dueDate = convertToDate(data.dueDate);
		this.value = setValueNumberToDadaBase(data.value) as number;
		this.commissionValue = setValueNumberToDadaBase(data.commissionValue);
		this.installments = Number(data.installments) || 1;
		this.description = convertBlobToString(data.description);
		this.paymentId = Number(data.paymentId);
		this.unitId = Number(data.unitId);
		this.tenancyId = Number(data.tenancyId);
		this.userId = Number(data.userId);
		this.sellerId = Number(data.sellerId);
	}
}
