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
	comments?: CommentModel[];

	constructor(data: ICommentModel, id?: number) {
		this.id = setInstanceId(id || data?.id);
		this.comment = convertBlobToString(data.comment) as string;
		this.active = !!data.active;
		this.taskId = setInstanceId(data.taskId);
		this.parentId = setInstanceId(data.parentId);
		this.user = this.setUser(data);
		this.tenancyId = Number(data.tenancyId);
		this.comments = this.setComments(data?.comments);
	}

	private setUser(user: ICommentUser | ICommentModel) {
		if ('name' in user) return user;

		const id = 'userId' in user ? Number(user?.userId) : 0;
		const { email } = user;
		return {
			id,
			name: `${user.firstName} ${user.lastName}`,
			email,
		};
	}

	private setComments(value?: ICommentModel[]) {
		if (!value) return [];
		return value?.map(i => new CommentModel(i));
	}
}
