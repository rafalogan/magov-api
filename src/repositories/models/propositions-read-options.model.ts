import { setInstanceId } from 'src/utils';
import { IPropositionsReadOptions } from '../types';

export class PropositionsReadOptionsModel {
	page?: number;
	limit?: number;
	orderBy?: string;
	order?: string;
	tenancyId?: number;
	all?: boolean;
	unitId?: number;
	constructor(options: IPropositionsReadOptions) {
		this.page = Number(options.page) || 1;
		this.limit = Number(options.limit) || 10;
		this.orderBy = options.orderBy;
		this.order = options.order;
		this.tenancyId = setInstanceId(options.tenancyId);
		this.all = !!options.all;
		this.unitId = setInstanceId(options.unitId);
	}
}
