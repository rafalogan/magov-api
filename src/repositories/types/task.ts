import { IID } from './shared';
import { IUnitExpense } from './unit-expense';
import { IComment } from 'src/repositories/types/comment';

export interface ITask extends IID {
	title: string;
	description?: Blob | string;
	cost?: number;
	start: Date | string;
	end: Date | string;
	level: number;
	statusId: number;
	userId: number;
	unitId: number;
	tenancyId: number;
	demandId?: number;
	propositionId?: number;
}

export interface ITaskModel extends ITask {
	setUnitExpense: boolean;
	unitExpense?: IUnitExpense;
	users: number[];
	themes: string[];
	comments?: IComment[];
	participants: IPlantiffTask[];
}

export interface ITaskViewModel extends IID {
	title: string;
	description?: Blob | string;
	cost?: number;
	start: Date | string;
	end: Date | string;
	level: number;
	status: ITaskStatus;
	users: ITaskUsers[];
	unitId: number;
	unit: ITaskUnit;
	tenancyId: number;
	proposition?: IPropositionTask;
	demand?: IDemandTask;
	participants: IPlantiffTask[];
	comments?: ICommentTask[];
	themes: IThemeTask[];
}

export interface ITaskStatus {
	id: number;
	status: string;
	description?: Blob | string;
}

export interface IThemeTask {
	id: number;
	theme: string;
}

export interface ICommentTask {
	id: number;
	comment: Blob | string;
	user: string;
	active: boolean;
}

export interface IPlantiffTask {
	id: number;
	name: string;
	email: string;
	phone: string;
}

export interface IDemandTask {
	id: number;
	name: string;
	deadline: Date;
}

export interface IPropositionTask {
	id: number;
	title: string;
	deadline: Date;
}

export interface ITaskUnit {
	id: number;
	demand: string;
}

export interface ITaskUsers {
	id: number;
	name: string;
}

export interface ITaskComment extends IID {
	comment: Blob | string;
	active?: boolean;
	taskId: number;
	userId: number;
	tenancyId: number;
	user?: string;
}
