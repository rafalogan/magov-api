import { convertBlobToString, convertToDate, setInstanceId } from 'src/utils';
import { IPropositionModel, ITask } from '../types';
import { Task } from 'src/repositories/entities';

export class PropositionModel {
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
	demands?: number[];
	tasks: Task[];

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
		this.tasks = this.setTasks(data);
	}

	private setTasks(data: IPropositionModel) {
		const { deadline, expense, unitId, tenancyId } = data;
		return data.tasks.map(
			item =>
				new Task(
					{
						title: item.task,
						description: data.menu,
						end: deadline,
						cost: expense,
						start: new Date(),
						status: 0,
						unitId,
						tenancyId,
						level: item.level,
						userId: item.userId,
					} as ITask,
					Number(item?.id)
				)
		);
	}
}
