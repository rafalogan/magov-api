import { IID } from './shared';

export interface ITenancy extends IID {
	tenancyKey?: string;
	totalUsers?: number;
	active: boolean;
	plans: ITenancyPlan[];
}

export interface ITenancyPlan {
	id: number;
	name: string;
	usersLimit?: number;
}

export interface ITenancyIdRequired {
	tenancyId: number;
}

export interface ITenacityIdOptional {
	tenancyId?: number;
}
