import { Plan } from 'src/repositories/entities';
import { convertBlobToString, setInstanceId } from 'src/utils';

export class PlanModel {
	id?: number;
	name: string;
	description?: string | Blob;
	limit?: number;
	value: number;
	active: boolean;

	constructor(data: Plan) {
		this.id = setInstanceId(data.id);
		this.name = data.name;
		this.description = convertBlobToString(data.description);
		this.limit = Number(data.limit) || undefined;
		this.value = data.value / 100;
		this.active = !!data.active;
	}
}
