import { Multer } from 'multer';

import { Credentials, UserViewModel } from 'src/repositories/models';
import { User } from 'src/repositories/entities';
import { IUserViewModel } from './user';
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

export interface IPayload extends IUserViewModel {
	iat: number;
	exp: number;
}

export interface AuthModuleOptions<T> extends ModuleOptions<T> {
	upload: Multer;
}
