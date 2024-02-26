import { IPaginationOptions } from './shared';

export interface IUserLog {
	action: string;
	inTable: string;
	inTableId: number;
	logDate: Date | string;
	userId: number;
	tenancyId: number;
}

export interface IUserLogVew extends IUserLog {
	id: number;
	firstName: string;
	lastName: string;
	userEmail: string;
}

export interface IUserLogReadOptions extends IPaginationOptions {
	userId?: number;
	tenancyId: number;
}