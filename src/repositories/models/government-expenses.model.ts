import { convertBlobToString, convertToDate, setInstanceId } from 'src/utils';
import { IGovernmentExpensesModel, IGExpenseBudget } from '../types';

export class GovernmentExpensesModel {
	id?: number;
	expense: string;
	description?: string;
	dueDate: Date;
	value: number;
	observations?: string;
	active: boolean;
	propositionId: number;
	taskId?: number;
	tenancyId: number;
	budgets?: IGExpenseBudget[];

	constructor(data: IGovernmentExpensesModel, id?: number) {
		this.id = setInstanceId(id || data?.id);
		this.expense = data.expense.trim();
		this.description = convertBlobToString(data?.description);
		this.dueDate = convertToDate(data.dueDate);
		this.value = Number(data.value);
		this.observations = convertBlobToString(data.observations);
		this.active = !!data.active;
		this.propositionId = Number(data.propositionId);
		this.taskId = Number(data?.taskId);
		this.tenancyId = Number(data.tenancyId);
		this.budgets = data.budgets;
	}
}
