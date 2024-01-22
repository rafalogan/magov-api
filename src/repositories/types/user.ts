import { IAddress } from './address';
import { IFile } from './file';
import { IProfileView } from './profile';
import { IRule } from './rule';
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

export interface IUserRuleView extends IRule {}

export interface IUserUnit {
	id: number;
	name: string;
}

export interface IUserModel extends IUser {
	userRules: Array<string | number>;
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
	profile: IProfileView;
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
