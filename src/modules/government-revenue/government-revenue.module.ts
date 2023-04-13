import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { GovernmentRevenueController } from './government-revenue.controller';
import { GovernmentRevenueRoute } from './government-revenue.route';
import { GovernmentRevenueService } from 'src/services';

export class GovernmentRevenueModule extends CommonModule {
	private readonly governmentRevenueController: GovernmentRevenueController;
	private governmentRevenueRoute: GovernmentRevenueRoute;

	constructor(options: ModuleOptions<GovernmentRevenueService>) {
		super();

		this.governmentRevenueController = new GovernmentRevenueController(options.service);
		this.governmentRevenueRoute = new GovernmentRevenueRoute(options, this.governmentRevenueController);
	}

	exec = () => this.governmentRevenueRoute.exec();
}
