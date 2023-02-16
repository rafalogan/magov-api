import { Credentials, UserModel } from 'src/repositories/models';
import { Profile, User } from '../entities';
import { IProfile } from 'src/repositories/types/profile';
import { RouteOptions } from 'src/repositories/types/route';
import { AuthService } from 'src/services';

export interface ICredentials {
	email: string;
	password: string;
}

export interface IsMachValidateOptions {
	credentials: Credentials;
	user: User | UserModel;
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
	profile: IProfile | Profile;
	iat: number;
	exp: number;
}

export interface AuthModuleOptions extends RouteOptions {
	service: AuthService;
}
