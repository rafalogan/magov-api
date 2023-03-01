import { randomUUID } from 'node:crypto';

import { ITenacy } from '../types';

export class Tenancy {
	id?: number;
	tenancyKey?: string;
	totalUsers?: number;
	active: boolean;

	constructor(data: ITenacy, id?: Number) {
		this.id = Number(id || data.id) || undefined;
		this.tenancyKey = data.tenancyKey || randomUUID();
		this.totalUsers = data.totalUsers;
		this.active = data.active;
	}
}
