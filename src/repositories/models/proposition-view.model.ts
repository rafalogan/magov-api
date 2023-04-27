import { convertBlobToString, convertToDate, setInstanceId, setValueNumberToView } from 'src/utils';
import { FileEntity, Keyword, Theme } from '../entities';
import { IBudgetProposition, IDemandPoprosition, IPropositionViewModel, ISubProposition, ITaskProposition } from '../types';

export class PropositionViewModel {
	id?: number;
	title: string;
	menu: string;
	deadline: Date | string;
	active: boolean;
	expense?: number;
	parentId?: number;
	unitId: number;
	typeId: number;
	file?: FileEntity;
	tenancyId: number;
	budgets?: IBudgetProposition[];
	keywords: Keyword[];
	themes: Theme[];
	demands?: IDemandPoprosition[];
	propositions?: ISubProposition[];
	tasks?: ITaskProposition[];

	constructor(data: IPropositionViewModel, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.title = data.title.trim();
		this.menu = convertBlobToString(data.menu) as string;
		this.deadline = convertToDate(data.deadline);
		this.active = !!data.active;
		this.expense = setValueNumberToView(data.expense);
		this.parentId = setInstanceId(data.parentId);
		this.unitId = Number(data.unitId);
		this.typeId = Number(data.typeId);
		this.file = data?.file ? new FileEntity(data.file) : undefined;
		this.tenancyId = Number(data.tenancyId);
		this.budgets = this.setBudgets(data.budgets);
		this.keywords = data.keywords.map(i => new Keyword(i));
		this.themes = data.themes.map(i => new Theme(i));
		this.demands = this.setDemands(data.demands);
		this.propositions = this.setSubPropositions(data.propositions);
		this.tasks = this.setTasks(data.tasks);
	}

	private setBudgets(value?: IBudgetProposition[]) {
		return !value
			? undefined
			: value.map(
					item =>
						({
							id: Number(item.id),
							revenue: item.revenue.trim(),
							value: setValueNumberToView(item.value),
						} as IBudgetProposition)
			  );
	}

	private setDemands(value?: IDemandPoprosition[]) {
		return !value ? undefined : value.map(i => ({ id: Number(i.id), name: i.name.trim() } as IDemandPoprosition));
	}

	private setSubPropositions(value?: ISubProposition[]) {
		return !value ? undefined : value.map(i => ({ id: Number(i.id), title: i.title.trim() } as ISubProposition));
	}

	private setTasks(value?: ITaskProposition[]) {
		return !value
			? undefined
			: value.map(
					i =>
						({
							id: setInstanceId(i.id),
							task: i.task.trim(),
							deadline: convertToDate(i.deadline),
							level: Number(i.level),
							userId: Number(i.userId),
							responsible: i.responsible?.trim() || undefined,
						} as ITaskProposition)
			  );
	}
}
