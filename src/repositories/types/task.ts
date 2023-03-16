import { IPlantiffModel } from './plantiff';
import { IID } from './shared';
import { IUnitExpense } from './unit-expense';

export interface ITask extends IID {
	title: string;
	description?: Blob | string;
	cost?: number;
	start: Date | string;
	end: Date | string;
	level: number;
	status: number;
	userId: number;
	unitId: number;
	tenancyId: number;
	propositionId?: number;
	demandId?: number;
	plaintiffId?: number;
}

export interface ITaskModel extends ITask {
	setUnitExpense: boolean;
	unitExpense?: IUnitExpense;
	plaintiff?: IPlantiffModel;
	users: number[];
	themes: string[];
	comments?: ITaskComment[];
}

export interface ITaskViewModel extends IID {
	title: string;
	description?: Blob | string;
	cost?: number;
	start: Date | string;
	end: Date | string;
	level: number;
	status: number;
	users: ITaskUsers[];
	unit: ITaskUnit;
	tenancyId: number;
	proposition?: IPropositionTask;
	demand?: IDemandTask;
	plaintiff?: IPlantiffTask;
	comments?: ICommentTask[];
	themes: IThemeTask[];
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
