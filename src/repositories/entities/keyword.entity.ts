import { setInstanceId } from 'src/utils';
import { IKeyword } from '../types';

export class Keyword {
	id?: number;
	keyword: string;
	constructor(data: IKeyword, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.keyword = data.keyword.trim();
	}
}
