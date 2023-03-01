import { Application } from 'express';
import { AuthConfig } from 'src/config';
import { IAuthConfig } from 'src/repositories/types/auth';

export interface RouteOptions {
	app: Application;
	auth?: AuthConfig;
}
