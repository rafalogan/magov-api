import { IID } from './shared';

export interface ITenacy extends IID {
	tenancyKey?: string;
	totalUsers?: number;
	active: boolean;
	plans: ITenacyPlan[];
}

export interface ITenacyPlan {
	id: number;
	name: string;
	usersLimit?: number;
}
