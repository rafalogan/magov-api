import { convertBlobToString, setInstanceId, setValueNumberToDadaBase } from 'src/utils';
import { IProduct } from '../types';

export class Plan {
	id?: number;
	name: string;
	description?: string;
	plan?: boolean;
	limit?: number;
	typeId: number;
	type?: string;
	value: number;
	amount?: number;
	active: boolean;

	constructor(data: IProduct, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.name = data.name;
		this.description = data.description ? convertBlobToString(data.description) : undefined;
		this.limit = data.limit || 0;
		this.typeId = Number(this.typeId);
		this.type = data.type;
		this.value = setValueNumberToDadaBase(data.value) as number;
		this.amount = Number(data.amount) || 1;
		this.active = !!data.active;
	}
}
