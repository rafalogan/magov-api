import { IReadOptions } from '../types';

export class ReadOptionsModel {
	page: number;
	limit: number;
	orderBy: string;
	order: string;
	tenancyId?: number;

	constructor(data: IReadOptions) {
		this.page = Number(data.page) || 1;
		this.limit = Number(data.limit) || 10;
		this.orderBy = data.orderBy || 'id';
		this.order = data.orderBy || 'asc';
		this.tenancyId = Number(data.tenancyId) || undefined;
	}
}
