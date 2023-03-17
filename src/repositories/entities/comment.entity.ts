import { convertBlobToString, setInstanceId } from 'src/utils';
import { IComment } from '../types';

export class Comment {
	id?: number;
	comment: string;
	active?: boolean;
	taskId?: number;
	parentId?: number;
	userId: number;
	tenancyId: number;

	constructor(data: IComment, id?: number) {
		this.id = setInstanceId(id || data?.id);
		this.comment = convertBlobToString(data.comment)?.trim() as string;
		this.active = !!data.active;
		this.taskId = setInstanceId(data.taskId);
		this.parentId = setInstanceId(data.parentId);
		this.userId = Number(data.userId);
		this.tenancyId = Number(data.tenancyId);
	}
}
