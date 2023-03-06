import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { InstituteTypeService } from 'src/services';
import { InstituteTypeController } from './institute-type.controller';
import { InstituteTypeRoute } from './institute-type.route';

export class InstituteTypeModule extends CommonModule {
	private readonly instituteTypeController: InstituteTypeController;
	private instituteTypeRoute: InstituteTypeRoute;

	constructor(options: ModuleOptions<InstituteTypeService>) {
		super();

		this.instituteTypeController = new InstituteTypeController(options.service);
		this.instituteTypeRoute = new InstituteTypeRoute(options, this.instituteTypeController);
	}

	exec = () => this.instituteTypeRoute.exec();
}
