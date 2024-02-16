import { convertBlobToString, convertToDate, setInstanceId, setValueNumberToView } from 'src/utils';
import { ICommentTask, IDemandTask, IPlantiffTask, IPropositionTask, ITaskUnit, ITaskUsers, ITaskViewModel, IThemeTask } from '../types';

export class TaskViewModel {
	id?: number;
	title: string;
	description?: string;
	cost?: number;
	start: Date;
	end: Date;
	level: number;
	resposibleId: number;
	responsible: string;
	status: number;
	users: ITaskUsers[];
	unitId: number;
	unit: ITaskUnit;
	tenancyId: number;
	proposition?: IPropositionTask;
	demand?: IDemandTask;
	participants?: IPlantiffTask[];
	comments?: ICommentTask[];
	themes: IThemeTask[];

	constructor(data: ITaskViewModel, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.title = data.title.trim();
		this.description = convertBlobToString(data.description);
		this.cost = setValueNumberToView(data.cost);
		this.start = convertToDate(data.start);
		this.end = convertToDate(data.end);
		this.level = Number(data.level);
		this.status = Number(data.status);
		this.users = this.setUsers(data.users);
		this.resposibleId = this.users[0].id;
		this.responsible = this.users[0].name;
		this.unitId = data.unitId;
		this.unit = data.unit;
		this.tenancyId = Number(data.tenancyId);
		this.proposition = this.setProposition(data.proposition);
		this.demand = this.setDemand(data.demand);
		this.participants = this.setParticipants(data.participants);
		this.comments = this.setComments(data.comments);
		this.themes = data.themes;
	}

	private setParticipants(data?: IPlantiffTask[]): IPlantiffTask[] {
		if (!data) return [];

		return data.map(i => ({ ...i, id: Number(i.id), name: i.name?.trim() }));
	}

	private setDemand(value?: IDemandTask) {
		if (!value) return undefined;
		return { id: Number(value.id), name: value.name.trim(), deadline: convertToDate(value.deadline) };
	}

	private setProposition(value?: IPropositionTask) {
		if (!value) return undefined;
		return { id: Number(value.id), title: value.title.trim(), deadline: convertToDate(value.deadline) };
	}

	private setComments(value?: ICommentTask[]) {
		if (!value) return [];

		return value.map(item => ({
			id: Number(item.id),
			comment: convertBlobToString(item.comment) as string,
			user: item.user.trim(),
			active: !!item.active,
		}));
	}

	private setUsers(value: ITaskUsers[]) {
		return value.map(i => ({ id: Number(i.id), name: i.name.trim() }));
	}
}
