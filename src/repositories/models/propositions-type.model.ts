import { convertBlobToString, setInstanceId } from 'src/utils';
import { FileEntity } from '../entities';
import { IPropositionsType } from '../types';

export class PropositionsTypeModel {
	id?: number;
	name: string;
	fileId?: number;
	description?: string;
	active: boolean;
	document?: FileEntity;
	parentId?: number;

	constructor(data: IPropositionsType, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.name = data.name.trim();
		this.fileId = Number(data.fileId);
		this.description = convertBlobToString(data.description);
		this.active = !!data.active;
		this.document = data?.document ? new FileEntity(data?.document) : undefined;
		this.parentId = data.parentId;
	}
}
