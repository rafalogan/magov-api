import { convertBlobToString, setInstanceId } from 'src/utils';
import { IProfile } from '../types';

export class Profile implements IProfile {
	id?: number;
	name: string;
	code: string;
	description?: string;
	active: boolean;

	constructor(data: IProfile, id?: number) {
		this.id = setInstanceId(id || data?.id);
		this.name = data.name;
		this.code = data.code.toUpperCase();
		this.description = convertBlobToString(data?.description);
		this.active = !!data.active;
	}
}
