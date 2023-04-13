import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { PlaintiffService } from 'src/services';
import { PlaintiffController } from './plaintiff.controller';
import { PlaintiffRoute } from './plaintiff.route';

export class PlaintiffModule extends CommonModule {
	private readonly plaintiffController: PlaintiffController;
	private plaintiffRoute: PlaintiffRoute;

	constructor(options: ModuleOptions<PlaintiffService>) {
		super();

		this.plaintiffController = new PlaintiffController(options.service);
		this.plaintiffRoute = new PlaintiffRoute(options, this.plaintiffController);
	}

	exec = () => this.plaintiffRoute.exec();
}
