import { convertBlobToString, convertToDate, setInstanceId, setValueNumberToView } from 'src/utils';
import { ICommentTask, IDemandTask, IPlantiffTask, IPropositionTask, ITaskComment, ITaskUnit, ITaskUsers, ITaskViewModel } from '../types';

export class TaskViewModel {
	id?: number;
	title: string;
	description?: string;
	cost?: number;
	start: Date;
	end: Date;
	level: number;
	status: number;
	users: ITaskUsers[];
	unit: ITaskUnit;
	tenancyId: number;
	proposition?: IPropositionTask;
	demand?: IDemandTask;
	plaintiffId?: IPlantiffTask;
	comments?: ICommentTask[];

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
		this.unit = data.unit;
		this.tenancyId = Number(data.tenancyId);
		this.proposition = this.setProposition(data.proposition);
		this.demand = this.setDemand(data.demand);
		this.plaintiffId = data.plaintiffId;
		this.comments = this.setComments(data.comments);
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
