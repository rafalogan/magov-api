import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { PlanService } from 'src/services';
import { PlanController } from './plan.controller';
import { PlanRoute } from './plan.route';

export class PlanModule extends CommonModule {
	private readonly planController: PlanController;
	private planRoute: PlanRoute;

	constructor(options: ModuleOptions<PlanService>) {
		super();

		this.planController = new PlanController(options.service);
		this.planRoute = new PlanRoute(options, this.planController);
	}

	exec = () => this.planRoute.exec();
}
