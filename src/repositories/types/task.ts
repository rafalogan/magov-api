import { IID } from './shared';

export interface ITask extends IID {
	title: string;
	description?: string;
	cost?: number;
	start: Date | string;
	end: Date | string;
	level: number;
	status: number;
	userId: number;
	unitId: number;
	tenacyId: number;
	propositionId?: number;
	demandId?: number;
	plaintiffId?: number;
}
