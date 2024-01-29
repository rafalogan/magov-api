import { convertBlobToString, convertToDate, setInstanceId, setValueNumberToView } from 'src/utils';
import { FileEntity, Keyword, Theme } from '../entities';
import { IDemandPoprosition, IGExpenseBudget, IPropositionViewModel, ISubProposition, ITaskProposition } from '../types';

export class PropositionViewModel {
	id?: number;
	title: string;
	menu: string;
	deadline: Date | string;
	active: boolean;
	expense?: number;
	parentId?: number;
	unitId: number;
	unitName: string;
	typeId: number;
	typeName: string;
	propositionUrl?: string;
	file?: FileEntity;
	tenancyId: number;
	budgets?: IGExpenseBudget[];
	keywords: Keyword[];
	themes: Theme[];
	demands?: IDemandPoprosition[];
	propositions?: ISubProposition[];
	tasks?: ITaskProposition[];
	textEditor?: string;

	constructor(data: IPropositionViewModel, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.title = data.title.trim();
		this.menu = convertBlobToString(data.menu) as string;
		this.deadline = convertToDate(data.deadline);
		this.active = !!data.active;
		this.expense = setValueNumberToView(data.expense);
		this.parentId = setInstanceId(data.parentId);
		this.unitId = Number(data.unitId);
		this.unitName = data.unitName;
		this.typeId = Number(data.typeId);
		this.typeName = data.typeName;
		this.propositionUrl = data.propositionUrl || undefined;
		this.file = data?.file ? new FileEntity(data.file) : undefined;
		this.tenancyId = Number(data.tenancyId);
		this.budgets = this.setBudgets(data.budgets);
		this.keywords = data.keywords.map(i => new Keyword(i));
		this.themes = data.themes.map(i => new Theme(i));
		this.demands = this.setDemands(data.demands);
		this.propositions = this.setSubPropositions(data.propositions);
		this.tasks = this.setTasks(data.tasks);
		this.textEditor = convertBlobToString(data.textEditor);
	}

	private setBudgets(value?: IGExpenseBudget[]): IGExpenseBudget[] {
		if (!value) return [];

		return value.map(i => ({
			id: Number(i.id),
			revenue: i.revenue?.trim(),
			value: setValueNumberToView(i.value),
		}));
	}

	private setDemands(value?: IDemandPoprosition[]) {
		return !value ? undefined : value.map(i => ({ id: Number(i.id), name: i.name.trim() }) as IDemandPoprosition);
	}

	private setSubPropositions(value?: ISubProposition[]) {
		return !value ? undefined : value.map(i => ({ id: Number(i.id), title: i.title.trim() }) as ISubProposition);
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
						}) as ITaskProposition
				);
	}
}
