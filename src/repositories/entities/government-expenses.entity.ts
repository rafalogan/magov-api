import { convertBlobToString, convertToDate, setInstanceId, setValueNumberToDadaBase } from 'src/utils';
import { IGovernmentExpensesModel } from '../types';

export class GovernmentExpenses {
	id?: number;
	expense: string;
	description?: string;
	dueDate: Date;
	value: number;
	observations?: string;
	active: boolean;
	propositionId?: number;
	tasksId?: number;
	tenancyId: number;

	constructor(data: IGovernmentExpensesModel, id?: number) {
		this.id = setInstanceId(id || data?.id);
		this.expense = data.expense.trim();
		this.description = convertBlobToString(data.description);
		this.dueDate = convertToDate(data.dueDate);
		this.value = setValueNumberToDadaBase(data.value) as number;
		this.observations = convertBlobToString(data.observations);
		this.active = !!data.active;
		this.propositionId = setInstanceId(data.propositionId);
		this.tasksId = setInstanceId(data.taskId);
		this.tenancyId = Number(data.tenancyId);
	}
}
