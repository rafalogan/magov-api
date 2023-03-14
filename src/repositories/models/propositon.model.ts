import { convertBlobToString, convertToDate, setInstanceId } from 'src/utils';
import { IPropositionModel, ITaskProposition } from '../types';

export class PropositonModel {
	id?: number;
	title: string;
	menu: string;
	deadline: Date;
	active: boolean;
	expense?: number;
	parentId?: number;
	unitId: number;
	typeId: number;
	tenancyId: number;
	budgets?: number[];
	keywords: string[];
	themes: string[];
	demands: number[];
	tasks: ITaskProposition[];

	constructor(data: IPropositionModel, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.title = data.title.trim();
		this.menu = convertBlobToString(data.menu) as string;
		this.deadline = convertToDate(data.deadline);
		this.active = !!data.active;
		this.expense = data.expense;
		this.parentId = setInstanceId(data.parentId);
		this.unitId = Number(data.unitId);
		this.typeId = Number(data.typeId);
		this.tenancyId = Number(data.tenancyId);
		this.budgets = data.budgets;
		this.keywords = data.keywords;
		this.themes = data.themes;
		this.demands = data.demands;
		this.tasks = data.tasks;
	}
}
