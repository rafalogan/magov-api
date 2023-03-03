import { Plan } from 'src/repositories/entities';
import { convertBlobToString, setInstanceId } from 'src/utils';

export class PlanModel {
	id?: number;
	name: string;
	description?: string | Blob;
	usersLimit?: number;
	unitaryValue: number;

	constructor(data: Plan) {
		this.id = setInstanceId(data.id);
		this.name = data.name;
		this.description = convertBlobToString(data.description);
		this.usersLimit = Number(data.usersLimit) || undefined;
		this.unitaryValue = data.unitaryValue / 100;
	}
}
