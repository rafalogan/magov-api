import { resolve } from 'node:path';
import express, { Application } from 'express';
import { Multer } from 'multer';

import { AuthConfig } from 'src/config';
import { notfoundRoute } from 'src/core/routes';
import { AuthModule } from 'src/modules/auth';
import { RouteOptions } from 'src/repositories/types';
import { ServicesFactory } from './services.factory';
import { UserModule } from 'src/modules/user';
import { UnitModule } from 'src/modules/unit';

export class ModulesFactory {
	private authModule: AuthModule;
	private userModule: UserModule;
	private unitModule: UnitModule;

	constructor(private app: Application, private auth: AuthConfig, services: ServicesFactory, upload: Multer) {
		this.authModule = new AuthModule({ ...this.getRouteOptions(), service: services.authService, upload });
		this.userModule = new UserModule({ ...this.getRouteOptions(), service: services.userService }, upload);
		this.unitModule = new UnitModule({ ...this.getRouteOptions(), service: services.unitService });
	}

	exec() {
		this.authModule.exec();
		this.userModule.exec();
		this.unitModule.exec();
		this.app.use('/media', express.static(resolve(__dirname, '../..', 'tmp', 'uploads')));
		this.app.use(notfoundRoute);
	}

	private getRouteOptions = (): RouteOptions => ({ app: this.app, auth: this.auth });
}
