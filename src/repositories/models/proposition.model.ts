import { convertBlobToString, convertToDate, setInstanceId } from 'src/utils';
import { IGExpenseBudget, IPropositionModel, ITask } from '../types';
import { FileEntity, Task } from 'src/repositories/entities';

export class PropositionModel {
	id?: number;
	title: string;
	menu: string;
	deadline: Date;
	active: boolean;
	expense?: number;
	parentId?: number;
	unitId: number;
	userId: number;
	typeId: number;
	propositionUrl?: string;
	file?: FileEntity;
	tenancyId: number;
	budgets?: IGExpenseBudget[];
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
		this.userId = Number(data.userId);
		this.typeId = Number(data.typeId);
		this.propositionUrl = data.propositionUrl || undefined;
		this.tenancyId = Number(data.tenancyId);
		this.file = data.file ? new FileEntity(data?.file) : undefined;
		this.budgets = this.setBudgets(data.budgets);
		this.keywords = data.keywords;
		this.themes = data.themes;
		this.demands = data.demands;
		this.tasks = this.setTasks(data);
	}

	private setBudgets(data?: IGExpenseBudget[]): IGExpenseBudget[] {
		if (!data) return [];

		return data.map(i => ({ ...i, id: Number(i.id), value: Number(i.value) }));
	}

	private setTasks(data: IPropositionModel) {
		const { menu, expense, unitId, tenancyId, themes, keywords, title, deadline, userId } = data;
		const tasks: Task[] = [];

		if (!data?.tasks?.length) {
			tasks.push(
				new Task(
					{
						title,
						description: menu,
						end: deadline,
						cost: expense,
						start: new Date(),
						status: 1,
						unitId,
						tenancyId,
						level: 1,
						userId: userId,
						themes,
						keywords,
					} as ITask,
					Number(data?.id)
				)
			);
		}

		for (const item of data.tasks) {
			tasks.push(
				new Task(
					{
						title: item.task,
						description: menu,
						end: item.deadline || deadline,
						cost: expense,
						start: new Date(),
						status: 1,
						unitId,
						tenancyId,
						level: item.level,
						userId: item.userId,
						themes,
						keywords,
					} as ITask,
					Number(item?.id)
				)
			);
		}

		return tasks;
	}
}
