import { Knex } from 'knex';
import { RedisClientType } from 'redis';

import { MailerConfig } from 'src/config';
import { IServiceOptions } from 'src/repositories/types';
import {
	AuthService,
	CommentService,
	ContactService,
	DemandService,
	GovernmentExpensesService,
	GovernmentRevenueService,
	InstituteTypeService,
	KeywordService,
	MailService,
	MessageTriggerService,
	NotificationService,
	OriginService,
	PaymentFormService,
	PlaintiffService,
	PlanService,
	ProductService,
	ProfileService,
	PropositionService,
	PropositionsTypeService,
	RevenueService,
	RuleService,
	SalePaymentService,
	SaleService,
	ScreenService,
	SupplierService,
	TaskService,
	TaskStatusService,
	ThemeService,
	TypesRecipesService,
	UnitExpenseService,
	UnitService,
	UserLogService,
	UserService,
} from 'src/services';

export class ServicesFactory {
	userLogService: UserLogService;
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
	commentService: CommentService;
	unitExpenseService: UnitExpenseService;
	saleService: SaleService;
	productService: ProductService;
	governmentExpenseService: GovernmentExpensesService;
	salePaymentService: SalePaymentService;
	paymentFormService: PaymentFormService;
	supplierService: SupplierService;
	typesRecipesService: TypesRecipesService;
	governmentRevenueService: GovernmentRevenueService;
	notificationService: NotificationService;
	screenService: ScreenService;
	messageTriggersService: MessageTriggerService;
	profileService: ProfileService;
	taskStatusService: TaskStatusService;

	constructor(
		private conn: Knex,
		private client: RedisClientType,
		private mailConfig: MailerConfig
	) {
		this.userLogService = new UserLogService(conn);
		this.unitService = new UnitService({ ...this.setServiceOptions() });
		this.userService = new UserService({ ...this.setServiceOptions() }, this.unitService);
		this.governmentExpenseService = new GovernmentExpensesService(this.setServiceOptions());
		this.mailService = new MailService(this.mailConfig);
		this.authService = new AuthService(this.userService, this.mailService);
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
		this.propositionService = new PropositionService(this.setServiceOptions(), this.governmentExpenseService);
		this.commentService = new CommentService(this.setServiceOptions());
		this.unitExpenseService = new UnitExpenseService(this.setServiceOptions());
		this.salePaymentService = new SalePaymentService(this.setServiceOptions());
		this.saleService = new SaleService(this.setServiceOptions(), this.userService);
		this.productService = new ProductService(this.setServiceOptions());
		this.taskService = new TaskService(this.setServiceOptions(), this.governmentExpenseService, this.unitExpenseService);
		this.paymentFormService = new PaymentFormService(this.setServiceOptions());
		this.supplierService = new SupplierService(this.setServiceOptions());
		this.typesRecipesService = new TypesRecipesService(this.setServiceOptions());
		this.governmentRevenueService = new GovernmentRevenueService(this.setServiceOptions());
		this.notificationService = new NotificationService(this.mailService);
		this.screenService = new ScreenService(this.setServiceOptions());
		this.profileService = new ProfileService(this.setServiceOptions());
		this.messageTriggersService = new MessageTriggerService(this.setServiceOptions());
		this.taskStatusService = new TaskStatusService(this.setServiceOptions());
	}

	private setServiceOptions = (): IServiceOptions => ({ conn: this.conn, cacheClient: this.client, userLogService: this.userLogService });
}
