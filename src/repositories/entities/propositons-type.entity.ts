import { convertBlobToString, setInstanceId } from 'src/utils';
import { IPropositonsType } from '../types';

export class PropositonsType {
	id?: number;
	name: string;
	description?: string;
	active: boolean;

	constructor(data: IPropositonsType, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.name = data.name.trim();
		this.description = convertBlobToString(data.description);
		this.active = !!data.active;
	}
}
