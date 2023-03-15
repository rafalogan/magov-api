import { Multer } from 'multer';

import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';

import { PropositionsTypeService } from 'src/services';
import { PropositionsTypeController, PropositionsTypeRoute } from 'src/modules/propositions-type';

export class PropositionsTypeModule extends CommonModule {
	private readonly PropositionsTypeController: PropositionsTypeController;
	private PropositionsTypeRoute: PropositionsTypeRoute;

	constructor(options: ModuleOptions<PropositionsTypeService>, upload: Multer) {
		super();

		this.PropositionsTypeController = new PropositionsTypeController(options.service);
		this.PropositionsTypeRoute = new PropositionsTypeRoute(options, upload, this.PropositionsTypeController);
	}

	exec = () => this.PropositionsTypeRoute.exec();
}
