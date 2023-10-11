import { convertBlobToString, convertToDate, setInstanceId } from 'src/utils';
import { FileEntity, Origin } from '../entities';
import { IFile, IOrigin, IRevenueModel } from '../types';

export class RevenueModel {
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
	unit?: string;
	tenancyId: number;
	document?: FileEntity;
	origin: Origin;
	government: boolean;
	balance: number;

	constructor(data: IRevenueModel, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.revenue = data.revenue.trim();
		this.receive = convertToDate(data.receive);
		this.description = convertBlobToString(data.description);
		this.status = Number(data.status);
		this.active = !!data.active;
		this.recurrent = !!data.recurrent;
		this.documentUrl = data.documentUrl?.trim();
		this.value = data.value;
		this.unitId = Number(data.unitId);
		this.unit = data.unit;
		this.tenancyId = data.tenancyId;
		this.document = data.document ? new FileEntity(data?.document as IFile) : undefined;
		this.origin = typeof data.origin === 'string' ? new Origin({ origin: data.origin }) : new Origin(data.origin as IOrigin);
		this.government = !!data.government;
		this.balance = data.balance || 0;
	}
}
