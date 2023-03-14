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
	status: number;
	userId: number;
	unitId: number;
	tenacyId: number;
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
		this.status = Number(data.status);
		this.userId = Number(data.userId);
		this.unitId = Number(data.unitId);
		this.tenacyId = Number(data.tenacyId);
		this.propositionId = setInstanceId(data.propositionId);
		this.demandId = setInstanceId(data.demandId);
		this.plaintiffId = setInstanceId(data.plaintiffId);
	}
}
