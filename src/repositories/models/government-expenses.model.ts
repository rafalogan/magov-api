import { convertBlobToString, convertToDate, setInstanceId, setValueNumberToView } from 'src/utils';
import { IGovernmentExpensesModel, IPropositionGovExpense, ITaskGovExpense } from '../types';

export class GovernmentExpensesModel {
	id?: number;
	expense: string;
	description?: string;
	dueDate: Date;
	value: number;
	observations?: string;
	active: boolean;
	proposition?: IPropositionGovExpense;
	task?: ITaskGovExpense;
	tenancyId: number;

	constructor(data: IGovernmentExpensesModel, id?: number) {
		this.id = setInstanceId(id || data?.id);
		this.expense = data.expense.trim();
		this.description = convertBlobToString(data?.description);
		this.dueDate = convertToDate(data.dueDate);
		this.value = setValueNumberToView(data.value) as number;
		this.observations = convertBlobToString(data.observations);
		this.active = !!data.active;
		this.proposition = data?.proposition;
		this.task = data?.task;
		this.tenancyId = Number(data.tenancyId);
	}
}
