import { Credentials, UserModel, UserViewModel } from 'src/repositories/models';
import { User } from 'src/repositories/entities';
import { RouteOptions } from 'src/repositories/types/route';
// import { AuthService } from 'src/services';
import { IUserRule, IUserUnit } from './user';

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

// export interface AuthModuleOptions extends RouteOptions {
// 	service: AuthService;
// }
