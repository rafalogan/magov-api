import { convertBlobToString, setInstanceId } from 'src/utils';
import { ITaskStatus } from '../types';

export class TaskStatus implements ITaskStatus {
	id?: number;
	status: string;
	description?: string;

	constructor(data: ITaskStatus, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.status = data.status?.trim();
		this.description = convertBlobToString(data.description);
	}
}
