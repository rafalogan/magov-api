import { Application } from 'express';
import { AuthConfig } from 'src/config';

export interface RouteOptions {
	app: Application;
	auth?: AuthConfig;
}
