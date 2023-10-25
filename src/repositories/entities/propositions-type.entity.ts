import { convertBlobToString, setInstanceId } from 'src/utils';
import { IPropositionsType } from '../types';

export class PropositionsType {
	id?: number;
	name: string;
	fileId?: number;
	description?: string;
	active: boolean;

	constructor(data: IPropositionsType, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.name = data.name.trim();
		this.fileId = setInstanceId(data.fileId);
		this.description = convertBlobToString(data.description);
		this.active = !!data.active;
	}
}
