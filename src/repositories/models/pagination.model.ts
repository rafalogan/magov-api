import { IPagination } from '../types';

export class PaginationModel {
	page: number;
	pages: number;
	limit: number;
	total: number;

	constructor(data: IPagination) {
		Object.assign(this, data);

		this.page = Number(Math.ceil(data.total / data.limit));
	}
}
