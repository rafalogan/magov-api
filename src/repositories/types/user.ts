import { IAddress } from './address';
import { IFile } from './file';
import { IID } from './shared';

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
	id: number;
	name: string;
}

export interface IUserUnit {
	id: number;
	name: string;
}

export interface IUserModel extends IUser {
	userRules: number[];
	address: IAddress;
	planId?: number;
	image?: IFile;
}

export interface IUserViewModel extends IUser {
	userRules: IUserRule[];
	address: IAddress;
	unit: IUserUnit;
	image?: IFile;
}
