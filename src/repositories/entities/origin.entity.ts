import { convertBlobToString, setInstanceId } from 'src/utils';
import { IOrigin } from '../types';

export class Origin {
	id?: number;
	origin: string;
	description?: string;

	constructor(data: IOrigin, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.origin = data.origin.trim();
		this.description = convertBlobToString(data.description);
	}
}
