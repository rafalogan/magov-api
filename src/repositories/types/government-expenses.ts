import { IID } from './shared';

export interface IGovernmentExpenses extends IID {
	expense: string;
	description?: Blob | string;
	dueDate: Date | string;
	value: number;
	observations?: Blob | string;
	active: boolean;
	propositionId?: number;
	tasksId?: number;
	tenancyId: number;
}

export interface IGovernmentExpensesModel extends IID {
	expense: string;
	description?: Blob | string;
	dueDate: Date | string;
	value: number;
	observations?: Blob | string;
	active: boolean;
	proposition?: IPropositionGovExpense;
	task?: ITaskGovExpense;
	tenancyId: number;
}

export interface IPropositionGovExpense {
	id: number;
	title: string;
}

export interface ITaskGovExpense {
	id: number;
	title: string;
}
