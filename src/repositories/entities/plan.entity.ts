import { convertBlobToString, setInstanceId } from 'src/utils';
import { IPlan } from '../types';

export class Plan {
	id?: number;
	name: string;
	description?: string;
	plan?: boolean;
	limit?: number;
	value: number;
	active: boolean;

	constructor(data: IPlan, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.name = data.name;
		this.description = data.description ? convertBlobToString(data.description) : undefined;
		this.plan = !!data.plan;
		this.limit = data.limit || 0;
		this.value = Number.isInteger(data.value) ? Number(data.value) : Number(data.value) * 100;
		this.active = !!data.active;
	}
}
