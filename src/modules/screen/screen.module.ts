import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { ScreenController } from './screen.controller';
import { ScreenRoute } from './screen.route';
import { ScreenService } from 'src/services';

export class ScreenModule extends CommonModule {
	private readonly screenController: ScreenController;
	private screenRoute: ScreenRoute;

	constructor(options: ModuleOptions<ScreenService>) {
		super();

		this.screenController = new ScreenController(options.service);
		this.screenRoute = new ScreenRoute(options, this.screenController);
	}

	exec = () => this.screenRoute.exec();
}
