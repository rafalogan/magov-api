import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { RuleService } from 'src/services';
import { RuleController } from './rule.controller';
import { RuleRoute } from './rule.route';

export class RuleModule extends CommonModule {
	private ruleController: RuleController;
	private ruleRoute: RuleRoute;

	constructor(options: ModuleOptions<RuleService>) {
		super();

		this.ruleController = new RuleController(options.service);
		this.ruleRoute = new RuleRoute(options, this.ruleController);
	}

	exec = () => this.ruleRoute.exec();
}
