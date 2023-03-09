import { convertBlobToString, convertToDate, setInstanceId } from 'src/utils';
import { IDemands, IDemanTask } from '../types';

export class DemandListModel {
	id?: number;
	favorite: boolean;
	level: number;
	description: string;
	deadLine: Date;
	createdAt: Date;
	responsible: string;
	plaintiff: string;
	uf: string;
	city: string;
	district: string;
	tasks?: IDemanTask[];
	userId: number;
	plaintiffId: number;

	constructor(data: IDemands) {
		this.id = setInstanceId(data?.id);
		this.favorite = !!data.favorite;
		this.level = Number(data.level);
		this.description = convertBlobToString(data.description) || '';
		this.deadLine = convertToDate(data.deadLine);
		this.createdAt = convertToDate(data.createdAt);
		this.responsible = `${data.firstNameResponsible} ${data.lastNameResponsible}`;
		this.plaintiff = data.plaintiff.trim();
		this.uf = data.uf.trim();
		this.city = data.city.trim();
		this.district = data.district.trim();
		this.tasks = this.setTasks(data?.tasks);
		this.userId = Number(data.userId);
		this.plaintiffId = Number(data.plaintiffId);
	}

	private setTasks(value?: IDemanTask[]) {
		if (!value?.length) return [];

		return value.map(task => ({ id: Number(task.id), title: task.title.trim() }));
	}
}
