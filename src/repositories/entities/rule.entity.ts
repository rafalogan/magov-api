import { convertBlobToString, setInstanceId } from 'src/utils';
import { IRule } from '../types';

export class Rule {
	id?: number;
	code: string;
	name: string;
	description?: string;

	constructor(data: IRule, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.code = data.code.trim();
		this.name = data.name.trim();
		this.description = data.description ? convertBlobToString(data.description) : undefined;
	}
}
