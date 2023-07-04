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
	propositionId: number;
	taskId?: number;
	tenancyId: number;
	budgets?: IGExpenseBudget[];
}

export interface IGExpenseBudget {
	id: number;
	revenue?: string;
	value?: number;
}

export interface IPropositionGovExpense {
	id: number;
	title: string;
}

export interface ITaskGovExpense {
	id: number;
	title: string;
}

export interface IGovernmentExpenseViewModel {
	id: number;
	expense: string;
	description?: Blob | string;
	dueDate: Date | string;
	value: number;
	observations?: Blob | string;
	active: boolean;
	proposition: IPropositionGovExpense;
	task?: ITaskGovExpense;
	tenancyId: number;
	budgets?: IGExpenseBudget[];
}

export interface IGovernmentReserve {
	id: number;
	reserves: IGovernmentRevenueReserve[];
}

export interface IGovernmentRevenueReserve {
	id: number;
	date: Date | string;
	value: number;
	revenue: string;
	revenueValue: number;
}
