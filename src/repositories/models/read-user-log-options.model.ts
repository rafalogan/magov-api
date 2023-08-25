import { IUserLogReadOptions } from '../types';
import { setInstanceId } from 'src/utils';

export class ReadUserlogOptionsModel {
	userId?: number;
	tenancyId: number;
	page: number;
	limit: number;

	constructor(data: IUserLogReadOptions) {
		this.userId = setInstanceId(data.userId);
		this.tenancyId = Number(data.tenancyId);
		this.page = Number(data.page) || 1;
		this.limit = Number(data.limit) || 10;
	}
}
