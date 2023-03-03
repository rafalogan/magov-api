import { convertBlobToString, setInstanceId } from 'src/utils';
import { IPlan } from '../types';

export class Plan {
	id?: number;
	name: string;
	description?: string;
	usersLimit?: number;
	unitaryValue: number;

	constructor(data: IPlan, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.name = data.name;
		this.description = data.description ? convertBlobToString(data.description) : undefined;
		this.usersLimit = data.usersLimit || 0;
		this.unitaryValue = Number.isInteger(data.unitaryValue) ? Number(data.unitaryValue) : Number(data.unitaryValue) * 100;
	}
}
