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
import { InstituteTypeModule } from 'src/modules/institute-type';
import { DemandModule } from 'src/modules/demand';
import { PlaintiffModule } from 'src/modules/plaintiff';
import { ContactModule } from 'src/modules/contact';
import { PropositionsTypeModule } from 'src/modules/propositions-type';
import { OriginModule } from 'src/modules/origin';
import { RevenueModule } from 'src/modules/revenue';
import { PropositionModule } from 'src/modules/proposition';
import { TaskModule } from 'src/modules/task';
import { CommentModule } from 'src/modules/comment';
import { UnitExpenseModule } from 'src/modules/unit-expense';
import { SaleModule } from 'src/modules/sale';
import { ProductModule } from 'src/modules/product';

export class ModulesFactory {
	private authModule: AuthModule;
	private userModule: UserModule;
	private unitModule: UnitModule;
	private keywordModule: KeywordModule;
	private themeModule: ThemeModule;
	private planModule: PlanModule;
	private ruleModule: RuleModule;
	private instituteTypeModule: InstituteTypeModule;
	private demandModule: DemandModule;
	private plaintiffModule: PlaintiffModule;
	private contactModule: ContactModule;
	private propositionsTypeModule: PropositionsTypeModule;
	private originModule: OriginModule;
	private revenueModule: RevenueModule;
	private propositionModule: PropositionModule;
	private taskModule: TaskModule;
	private commentModule: CommentModule;
	private unitExpenseModule: UnitExpenseModule;
	private saleModule: SaleModule;
	private productModule: ProductModule;

	constructor(private app: Application, private auth: AuthConfig, services: ServicesFactory, upload: Multer) {
		this.authModule = new AuthModule({ ...this.getRouteOptions(), service: services.authService, upload });
		this.planModule = new PlanModule({ ...this.getRouteOptions(), service: services.planService });
		this.userModule = new UserModule({ ...this.getRouteOptions(), service: services.userService }, upload);
		this.unitModule = new UnitModule({ ...this.getRouteOptions(), service: services.unitService });
		this.themeModule = new ThemeModule({ ...this.getRouteOptions(), service: services.themeService });
		this.keywordModule = new KeywordModule({ ...this.getRouteOptions(), service: services.keywordService });
		this.ruleModule = new RuleModule({ ...this.getRouteOptions(), service: services.ruleService });
		this.instituteTypeModule = new InstituteTypeModule({ ...this.getRouteOptions(), service: services.instituteTypeService });
		this.demandModule = new DemandModule({ ...this.getRouteOptions(), service: services.demandService });
		this.plaintiffModule = new PlaintiffModule({ ...this.getRouteOptions(), service: services.plaintiffService });
		this.contactModule = new ContactModule({ ...this.getRouteOptions(), service: services.contactService });
		this.propositionsTypeModule = new PropositionsTypeModule(
			{ ...this.getRouteOptions(), service: services.propositionTypeService },
			upload
		);
		this.originModule = new OriginModule({ ...this.getRouteOptions(), service: services.originService });
		this.revenueModule = new RevenueModule({ ...this.getRouteOptions(), service: services.revenueService }, upload);
		this.propositionModule = new PropositionModule({ ...this.getRouteOptions(), service: services.propositionService });
		this.taskModule = new TaskModule({ ...this.getRouteOptions(), service: services.taskService });
		this.commentModule = new CommentModule({ ...this.getRouteOptions(), service: services.commentService });
		this.unitExpenseModule = new UnitExpenseModule({ ...this.getRouteOptions(), service: services.unitExpenseService }, upload);
		this.saleModule = new SaleModule({ ...this.getRouteOptions(), service: services.saleService }, upload);
		this.productModule = new ProductModule({ ...this.getRouteOptions(), service: services.productService });
	}

	exec() {
		this.authModule.exec();
		this.planModule.exec();
		this.userModule.exec();
		this.unitModule.exec();
		this.keywordModule.exec();
		this.themeModule.exec();
		this.ruleModule.exec();
		this.instituteTypeModule.exec();
		this.demandModule.exec();
		this.plaintiffModule.exec();
		this.contactModule.exec();
		this.propositionsTypeModule.exec();
		this.originModule.exec();
		this.revenueModule.exec();
		this.propositionModule.exec();
		this.taskModule.exec();
		this.commentModule.exec();
		this.unitExpenseModule.exec();
		this.saleModule.exec();
		this.productModule.exec();
		this.app.use('/media', express.static(resolve(__dirname, '../..', 'tmp', 'uploads')));
		this.app.use(notfoundRoute);
	}

	private getRouteOptions = (): RouteOptions => ({ app: this.app, auth: this.auth });
}
