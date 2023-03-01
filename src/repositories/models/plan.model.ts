import { Plan } from 'src/repositories/entities';

export class PlanModel {
	id?: number;
	name: string;
	decription?: string | Blob;
	userLimit?: number;
	unitaryValue: number;

	constructor(data: Plan) {
		Object.assign(this, data);

		this.userLimit = Number(data.userLimit) || undefined;
		this.unitaryValue = Number.isInteger(data.unitaryValue) ? data.unitaryValue : Number(data.unitaryValue) * 100;
	}
}
