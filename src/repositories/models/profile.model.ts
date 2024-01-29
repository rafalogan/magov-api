import { convertBlobToString, setInstanceId } from 'src/utils';
import { IProfileModel } from '../types';

export class ProfileModel implements IProfileModel {
	id?: number;
	name: string;
	code: string;
	description?: string;
	active: boolean;
	rules: Array<string | number>;

	constructor(data: IProfileModel, id?: number) {
		this.id = setInstanceId(id || data?.id);
		this.name = data.name;
		this.code = data.code;
		this.description = convertBlobToString(data?.description);
		this.active = !!data.active;
		this.rules = this.getRules(data.rules);
	}

	private getRules(data: Array<string | number>): Array<string | number> {
		return data.map((rule: string | number) => (Number(rule) ? Number(rule) : String(rule).toUpperCase()));
	}
}
