import { IAddress } from './address';
import { IFile } from './file';
import { IID } from './shared';
import { IUnitModel } from './unit';

export interface IUser extends IID {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword?: string;
	cpf: string;
	phone: string;
	office: string;
	active: boolean;
	level: number;
	unitId?: number;
	tenancyId?: number;
}

export interface IUserRule {
	screenId: number;
	ruleId: number;
}

export interface IUserRuleView {
	screenId: number;
	screenName: string;
	ruleId: number;
	ruleName: string;
}

export interface IUserUnit {
	id: number;
	name: string;
}

export interface IUserModel extends IUser {
	userRules: IUserRule[];
	address: IAddress;
	plans: IUserPlan[];
	unit?: IUnitModel;
	image?: IFile;
	newTenancy?: boolean;
}

export interface IUserPlan {
	id: number;
	amount: number;
}

export interface IUserViewModel extends IUser {
	userRules: IUserRuleView[];
	address: IAddress;
	unit: IUserUnit;
	plan: IUserPlan;
	image?: IFile;
	plans?: IUserPlan[];
}

export interface IUserPlan {
	id: number;
	name: string;
}

export interface IUserRecovery {
	email: string;
	password: string;
	confirmPassword: string;
}
