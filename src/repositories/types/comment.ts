import { IID } from './shared';

export interface IComment extends IID {
	comment: Blob | string;
	active: boolean;
	taskId?: number;
	userId: number;
	parentId?: number;
	tenancyId: number;
}

export interface ICommentModel extends IID {
	comment: Blob | string;
	active: boolean;
	taskId: number;
	parentId?: number;
	userId: number;
	firstName: string;
	lastName: string;
	email: string;
	tenancyId: number;
	comments?: ICommentModel[];
}

export interface ICommentUser {
	id: number;
	name?: string;
	firstName?: string;
	lastName?: string;
	email: string;
}
