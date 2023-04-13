import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { GovernmentExpensesController } from './government-expenses.controller';
import { GovernmentExpensesRoute } from './government-expenses.route';
import { GovernmentExpensesService } from 'src/services';

export class GovernmentExpensesModule extends CommonModule {
	private readonly governmentExpensesController: GovernmentExpensesController;
	private governmentExpensesRoute: GovernmentExpensesRoute;

	constructor(options: ModuleOptions<GovernmentExpensesService>) {
		super();

		this.governmentExpensesController = new GovernmentExpensesController(options.service);
		this.governmentExpensesRoute = new GovernmentExpensesRoute(options, this.governmentExpensesController);
	}

	exec = () => this.governmentExpensesRoute.exec();
}
