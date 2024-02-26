import { convertBlobToString, setInstanceId } from 'src/utils';
import { IFile } from '../types';

export class FileEntity {
	id?: number;
	title?: string;
	alt?: string;
	name: string;
	filename: string;
	type: string;
	url: string;

	constructor(data: IFile, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.title = data.title;
		this.alt = data.alt ? convertBlobToString(data.alt) : undefined;
		this.name = data.name;
		this.filename = data.filename;
		this.type = data.type;
		this.url = data.url;
	}
}