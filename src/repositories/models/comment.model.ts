import { convertBlobToString, setInstanceId } from 'src/utils';
import { ICommentModel, ICommentUser } from '../types';

export class CommentModel {
	id?: number;
	comment: string;
	active: boolean;
	taskId?: number;
	parentId?: number;
	user: ICommentUser;
	tenancyId: number;

	constructor(data: ICommentModel, id?: number) {
		this.id = setInstanceId(id || data?.id);
		this.comment = convertBlobToString(data.comment) as string;
		this.active = !!data.active;
		this.taskId = setInstanceId(data.taskId);
		this.parentId = setInstanceId(data.parentId);
		this.user = this.setUser(data.user);
		this.tenancyId = Number(data.tenancyId);
	}

	private setUser(user: ICommentUser) {
		return {
			id: user.id,
			name: user.name || `${user.firstName} ${user.lastName}`,
			email: user.email,
		};
	}
}
