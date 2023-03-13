import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { OriginService } from 'src/services';
import { OriginController } from './origin.controller';
import { OriginRoute } from './origin.route';

export class OriginModule extends CommonModule {
	private readonly originController: OriginController;
	private originRoute: OriginRoute;

	constructor(options: ModuleOptions<OriginService>) {
		super();

		this.originController = new OriginController(options.service);
		this.originRoute = new OriginRoute(options, this.originController);
	}

	exec = () => this.originRoute.exec();
}
