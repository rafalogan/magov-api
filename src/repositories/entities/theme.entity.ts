import { convertBlobToString, setInstanceId } from 'src/utils';
import { ITheme } from '../types';

export class Theme {
	id?: number;
	name: string;
	description?: string;
	active: boolean;

	constructor(data: ITheme, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.name = data.name.trim();
		this.description = convertBlobToString(data.description);
		this.active = !!data.active;
	}
}
