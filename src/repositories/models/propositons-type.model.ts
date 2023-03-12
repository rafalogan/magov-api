import { convertBlobToString, setInstanceId } from 'src/utils';
import { FileEntity } from '../entities';
import { IPropositonsType } from '../types';

export class PropositonsTypeModel {
	id?: number;
	name: string;
	description?: string;
	active: boolean;
	document: FileEntity;

	constructor(data: IPropositonsType, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.name = data.name.trim();
		this.description = convertBlobToString(data.description);
		this.active = !!data.active;
		this.document = new FileEntity(data.document);
	}
}
