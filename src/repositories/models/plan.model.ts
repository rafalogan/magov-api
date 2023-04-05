import { Plan } from 'src/repositories/entities';
import { convertBlobToString, setInstanceId, setValueNumberToView } from 'src/utils';

export class PlanModel {
	id?: number;
	name: string;
	description?: string | Blob;
	limit?: number;
	value: number;
	active: boolean;

	constructor(data: Plan, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.name = data.name;
		this.description = convertBlobToString(data.description);
		this.limit = Number(data.limit) || undefined;
		this.value = setValueNumberToView(data.value) as number;
		this.active = !!data.active;
	}
}
