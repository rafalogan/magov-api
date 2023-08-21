import { Multer } from 'multer';

import { Credentials, UserViewModel } from 'src/repositories/models';
import { FileEntity, User } from 'src/repositories/entities';
import { IUserPlan, IUserRule, IUserUnit } from './user';
import { ModuleOptions } from './module';
import { Address } from 'aws-sdk/clients/ses';

export interface ICredentials {
	email: string;
	password: string;
}

export interface IsMachValidateOptions {
	credentials: Credentials;
	user: User | UserViewModel;
	message: string;
}

export interface IAuthConfig {
	authenticate(): any;
}

export interface IPayload {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	cpf: string;
	phone: string;
	office: string;
	active: boolean;
	level: number;
	address?: Address;
	userRules: IUserRule[];
	tenancyId?: number;
	unit: IUserUnit;
	plans?: IUserPlan[];
	image?: FileEntity;
	iat: number;
	exp: number;
}

export interface AuthModuleOptions<T> extends ModuleOptions<T> {
	upload: Multer;
}
