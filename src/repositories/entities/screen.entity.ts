import { convertBlobToString, setInstanceId } from 'src/utils';
import { IScreen } from '../types';

export class AppScreen {
	id?: number;
	code: string;
	name: string;
	description?: string;
	active: boolean;

	constructor(data: IScreen, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.code = data.code;
		this.name = data.name?.trim();
		this.description = convertBlobToString(data.description);
		this.active = !!data.active;
	}
}
