import { convertToDate } from 'src/utils';
import { IUserLogVew } from '../types';

export class UserLogView {
	id: number;
	action: string;
	inTable: string;
	inTableId: number;
	logDate: Date;
	userId: number;
	tenancyId: number;

	constructor(data: IUserLogVew) {
		this.id = Number(data.id);
		this.action = data.action;
		this.inTable = data.inTable;
		this.inTableId = Number(data.inTableId);
		this.logDate = convertToDate(data.logDate);
		this.userId = Number(data.userId);
		this.tenancyId = Number(data.tenancyId);
	}
}
