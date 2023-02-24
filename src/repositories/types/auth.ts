import { Multer } from 'multer';

import { Credentials, UserModel, UserViewModel } from 'src/repositories/models';
import { User } from 'src/repositories/entities';
import { RouteOptions } from 'src/repositories/types/route';
import { IUserRule, IUserUnit } from './user';
import { ModuleOptions } from './module';

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
	userRules: IUserRule[];
	tenancyId?: number;
	unit: IUserUnit;
	iat: number;
	exp: number;
}

export interface AuthModuleOptions<T> extends ModuleOptions<T> {
	upload: Multer;
}
