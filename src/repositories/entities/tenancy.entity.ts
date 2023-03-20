import { randomUUID } from 'node:crypto';

import { ITenancy } from '../types';
import { setInstanceId } from 'src/utils';

export class Tenancy {
	id?: number;
	tenancyKey?: string;
	totalUsers?: number;
	dueDate: Date;
	active: boolean;

	constructor(data: ITenancy, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.tenancyKey = data.tenancyKey || randomUUID();
		this.totalUsers = data.totalUsers;
		this.active = data.active;
	}
}
