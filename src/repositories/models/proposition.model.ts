import { convertBlobToString, convertToDate, setInstanceId } from 'src/utils';
import { IPropositionModel, ITask } from '../types';
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
	typeId: number;
	propositionUrl?: string;
	file?: FileEntity;
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
		this.propositionUrl = data.proprositionUrl || undefined;
		this.tenancyId = Number(data.tenancyId);
		this.file = data.file ? new FileEntity(data?.file) : undefined;
		this.budgets = data.budgets;
		this.keywords = data.keywords;
		this.themes = data.themes;
		this.demands = data.demands;
		this.tasks = this.setTasks(data);
	}

	private setTasks(data: IPropositionModel) {
		const { menu, expense, unitId, tenancyId } = data;
		return data.tasks.map(
			item =>
				new Task(
					{
						title: item.task,
						description: menu,
						end: item.deadline,
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
