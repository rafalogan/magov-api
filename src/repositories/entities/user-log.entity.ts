import { convertToDate } from 'src/utils';
import { IUserLog } from '../types';

export class UserLog {
	action: string;
	inTable: string;
	inTableId: number;
	logDate: Date;
	userId: number;
	tenancyId: number;

	constructor(data: IUserLog) {
		this.action = data.action?.trim();
		this.inTable = data.action?.trim();
		this.inTableId = Number(data.inTableId);
		this.logDate = convertToDate(data.logDate);
		this.userId = Number(data.userId);
		this.tenancyId = Number(data.tenancyId);
	}
}
