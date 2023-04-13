import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { DemandService } from 'src/services';
import { DemandController } from './demand.controller';
import { DemandRoute } from './demand.route';

export class DemandModule extends CommonModule {
	private readonly demandController: DemandController;
	private demandRoute: DemandRoute;

	constructor(options: ModuleOptions<DemandService>) {
		super();

		this.demandController = new DemandController(options.service);
		this.demandRoute = new DemandRoute(options, this.demandController);
	}

	exec = () => this.demandRoute.exec();
}
