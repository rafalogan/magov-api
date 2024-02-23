import { convertBlobToString, convertToDate, setInstanceId, setValueNumberToDadaBase } from 'src/utils';
import { ITask } from '../types';

export class Task {
	id?: number;
	title: string;
	description?: string;
	cost?: number;
	start: Date;
	end: Date;
	level: number;
	statusId: number;
	userId: number;
	unitId: number;
	tenancyId: number;
	propositionId?: number;
	demandId?: number;
	plaintiffId?: number;

	constructor(data: ITask, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.title = data.title.trim();
		this.description = convertBlobToString(data.description);
		this.cost = setValueNumberToDadaBase(data.cost);
		this.start = convertToDate(data.start);
		this.end = convertToDate(data.end);
		this.level = Number(data.level);
		this.statusId = Number(data.statusId);
		this.userId = Number(data.userId);
		this.unitId = Number(data.unitId);
		this.tenancyId = Number(data.tenancyId);
		this.propositionId = setInstanceId(data.propositionId);
		this.demandId = setInstanceId(data.demandId);
	}
}
