import { convertBlobToString } from 'src/utils';
import { IProfileView, IRule } from '../types';

export class ProfileView implements IProfileView {
	id?: number;
	name: string;
	code: string;
	description?: string;
	active: boolean;
	rules: IRule[];

	constructor(data: IProfileView) {
		this.id = Number(data.id);
		this.name = data.name;
		this.code = data.code.toUpperCase();
		this.description = convertBlobToString(data.description);
		this.active = !!data.active;
		this.rules = this.getRules(data.rules);
	}

	getRules(data: IRule[]): IRule[] {
		return data.map((rule: IRule) => ({
			id: Number(rule.id),
			name: rule.name,
			code: rule.code.toUpperCase(),
			description: convertBlobToString(rule.description),
		}));
	}
}
