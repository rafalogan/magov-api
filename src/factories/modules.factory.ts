import { Application } from 'express';
import { Multer } from 'multer';

import { AuthConfig } from 'src/config';
import { RouteOptions } from 'src/repositories/types';
import { ServicesFactory } from './services.factory';

export class ModulesFactory {
	constructor(private app: Application, private auth: AuthConfig, services: ServicesFactory, upload: Multer) {}

	exec() {}

	private getRouteOptions(): RouteOptions {
		return { app: this.app, auth: this.auth };
	}
}
