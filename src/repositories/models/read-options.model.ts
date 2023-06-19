import { IReadOptions } from '../types';

export class ReadOptionsModel {
	page: number;
	limit: number;
	orderBy?: string;
	order?: string;
	tenancyId?: number;
	unitId?: number;
	taskId?: number;

	constructor(data: IReadOptions) {
		this.page = Number(data.page) || 1;
		this.limit = Number(data.limit) || 10;
		this.orderBy = data.orderBy || undefined;
		this.order = data.orderBy || undefined;
		this.tenancyId = Number(data.tenancyId) || undefined;
		this.unitId = Number(data.unitId) || undefined;
		this.taskId = Number(data.taskId) || undefined;
	}
}
