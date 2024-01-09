import { IRule } from './rule';

export interface IProfile {
	id?: number;
	name: string;
	code: string;
	description?: string;
	active: boolean;
}

export interface IProfileView extends IProfile {
	rules: IRule[];
}
