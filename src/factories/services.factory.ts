import { Knex } from 'knex';
import { RedisClientType } from 'redis';

import { MailerConfig } from 'src/config';
import { IServiceOptions } from 'src/repositories/types';
import {
	AuthService,
	ContactService,
	DemandService,
	InstituteTypeService,
	KeywordService,
	MailService,
	OriginService,
	PlaintiffService,
	PlanService,
	PropositionService,
	PropositionsTypeService,
	RevenueService,
	RuleService,
	TaskService,
	ThemeService,
	UnitService,
	UserService,
} from 'src/services';

export class ServicesFactory {
	authService: AuthService;
	userService: UserService;
	planService: PlanService;
	mailService: MailService;
	unitService: UnitService;
	keywordService: KeywordService;
	themeService: ThemeService;
	ruleService: RuleService;
	instituteTypeService: InstituteTypeService;
	demandService: DemandService;
	plaintiffService: PlaintiffService;
	contactService: ContactService;
	propositionTypeService: PropositionsTypeService;
	revenueService: RevenueService;
	originService: OriginService;
	propositionService: PropositionService;
	taskService: TaskService;

	constructor(private conn: Knex, private client: RedisClientType, private mailConfig: MailerConfig) {
		this.userService = new UserService({ ...this.setServiceOptions() });
		this.mailService = new MailService(this.mailConfig);
		this.authService = new AuthService(this.userService, this.mailService);
		this.unitService = new UnitService({ ...this.setServiceOptions() });
		this.keywordService = new KeywordService(this.setServiceOptions());
		this.themeService = new ThemeService(this.setServiceOptions());
		this.planService = new PlanService(this.setServiceOptions());
		this.ruleService = new RuleService(this.setServiceOptions());
		this.instituteTypeService = new InstituteTypeService(this.setServiceOptions());
		this.demandService = new DemandService(this.setServiceOptions(), this.keywordService);
		this.plaintiffService = new PlaintiffService(this.setServiceOptions());
		this.contactService = new ContactService(this.setServiceOptions());
		this.propositionTypeService = new PropositionsTypeService(this.setServiceOptions());
		this.revenueService = new RevenueService(this.setServiceOptions());
		this.originService = new OriginService(this.setServiceOptions());
		this.propositionService = new PropositionService(this.setServiceOptions());
		this.taskService = new TaskService(this.setServiceOptions());
	}

	private setServiceOptions = (): IServiceOptions => ({ conn: this.conn, cacheClient: this.client });
}
