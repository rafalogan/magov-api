import { setInstanceId } from 'src/utils';
import { IInstituteType } from '../types';

export class InstituteType implements IInstituteType {
	id?: number;
	name: string;
	active: boolean;

	constructor(data: IInstituteType, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.name = data.name.trim();
		this.active = !!data.active;
	}
}
