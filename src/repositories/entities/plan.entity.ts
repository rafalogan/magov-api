import { convertBlobToString } from 'src/utils';
import { IPlan } from '../types';

export class Plan {
	id?: number;
	name: string;
	decription?: string;
	userLimit?: number;
	unitaryValue: number;

	constructor(data: IPlan, id?: number) {
		this.id = Number(id || data.id) ?? undefined;
		this.name = data.name;
		this.decription = data.description ? convertBlobToString(data.description) : undefined;
		this.userLimit = data.userLimit || 0;
		this.unitaryValue = Number(data.unitaryValue) / 100;
	}
}
