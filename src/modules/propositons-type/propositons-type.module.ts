import { Multer } from 'multer';

import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { PropositonsTypeController } from './propositons-type.controller';
import { PropositonsTypeRoute } from './propositons-type.route';
import { PropositonsTypeService } from 'src/services';

export class PropositonsTypeModule extends CommonModule {
	private readonly propositonsTypeController: PropositonsTypeController;
	private propositonsTypeRoute: PropositonsTypeRoute;

	constructor(options: ModuleOptions<PropositonsTypeService>, upload: Multer) {
		super();

		this.propositonsTypeController = new PropositonsTypeController(options.service);
		this.propositonsTypeRoute = new PropositonsTypeRoute(options, upload, this.propositonsTypeController);
	}

	exec = () => this.propositonsTypeRoute.exec();
}
