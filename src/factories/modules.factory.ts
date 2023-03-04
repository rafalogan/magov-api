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
import { KeywordModule } from 'src/modules/keyword';
import { ThemeModule } from 'src/modules/theme';
import { PlanModule } from 'src/modules/plan';
import { RuleModule } from 'src/modules/rule';

export class ModulesFactory {
	private authModule: AuthModule;
	private userModule: UserModule;
	private unitModule: UnitModule;
	private keywordModule: KeywordModule;
	private themeModule: ThemeModule;
	private planModule: PlanModule;
	private ruleModule: RuleModule;

	constructor(private app: Application, private auth: AuthConfig, services: ServicesFactory, upload: Multer) {
		this.authModule = new AuthModule({ ...this.getRouteOptions(), service: services.authService, upload });
		this.planModule = new PlanModule({ ...this.getRouteOptions(), service: services.planService });
		this.userModule = new UserModule({ ...this.getRouteOptions(), service: services.userService }, upload);
		this.unitModule = new UnitModule({ ...this.getRouteOptions(), service: services.unitService });
		this.themeModule = new ThemeModule({ ...this.getRouteOptions(), service: services.themeService });
		this.keywordModule = new KeywordModule({ ...this.getRouteOptions(), service: services.keywordService });
		this.ruleModule = new RuleModule({ ...this.getRouteOptions(), service: services.ruleService });
	}

	exec() {
		this.authModule.exec();
		this.planModule.exec();
		this.userModule.exec();
		this.unitModule.exec();
		this.keywordModule.exec();
		this.themeModule.exec();
		this.ruleModule.exec();
		this.app.use('/media', express.static(resolve(__dirname, '../..', 'tmp', 'uploads')));
		this.app.use(notfoundRoute);
	}

	private getRouteOptions = (): RouteOptions => ({ app: this.app, auth: this.auth });
}
