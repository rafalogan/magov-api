import { convertBlobToString, setInstanceId } from 'src/utils';
import { ITaskComment } from '../types';

export class Comment {
	id?: number;
	comment: string;
	active?: boolean;
	taskId: number;
	userId: number;
	tenancyId: number;
	user?: string;

	constructor(data: ITaskComment, id?: number) {
		this.id = setInstanceId(id || data?.id);
		this.comment = convertBlobToString(data.comment) as string;
		this.active = !!data.active;
		this.taskId = Number(data.taskId);
		this.userId = Number(data.userId);
		this.tenancyId = Number(data.tenancyId);
		this.user = data?.user?.trim() || undefined;
	}
}
