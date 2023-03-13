import { convertBlobToString, convertToDate, setInstanceId } from 'src/utils';
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
		this.documentUrl = data.documentUrl?.trim();
		this.value = Number.isInteger(data.value) ? Number(data.value) : Number(data.value) * 100;
		this.unitId = Number(data.unitId);
		this.originId = Number(data.originId);
		this.tenancyId = Number(data.tenancyId);
	}
}
