import { convertBlobToString, convertToDate, setInstanceId, setValueNumberToDadaBase } from 'src/utils';
import { IRevenueModel } from '../types';

export class Revenue {
	id?: number;
	revenue: string;
	receive: Date;
	description?: string;
	status: number;
	active: boolean;
	recurrent: boolean;
	documentUrl?: string;
	documentNumber?: string;
	value: number;
	unitId: number;
	originId: number;
	tenancyId: number;

	constructor(data: IRevenueModel, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.revenue = data.revenue.trim();
		this.receive = convertToDate(data.receive);
		this.description = convertBlobToString(data.description);
		this.status = Number(data.status);
		this.active = !!data.active;
		this.recurrent = !!data.recurrent;
		this.documentUrl = 'documentUrl' in data ? data.documentUrl?.trim() : undefined;
		this.documentNumber = 'documentNumber' in data ? data.documentNumber.trim() : undefined;
		this.value = setValueNumberToDadaBase(data.value) as number;
		this.unitId = Number(data.unitId);
		this.originId = Number(data.originId);
		this.tenancyId = Number(data.tenancyId);
	}
}
