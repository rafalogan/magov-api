import { Multer } from 'multer';

import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';

import { PropositionsTypeService } from 'src/services';
import { PropositionsTypeController, PropositionsTypeRoute } from 'src/modules/propositions-type';

export class PropositionsTypeModule extends CommonModule {
	private readonly propositionsTypeController: PropositionsTypeController;
	private propositionsTypeRoute: PropositionsTypeRoute;

	constructor(options: ModuleOptions<PropositionsTypeService>, upload: Multer) {
		super();

		this.propositionsTypeController = new PropositionsTypeController(options.service);
		this.propositionsTypeRoute = new PropositionsTypeRoute(options, upload, this.propositionsTypeController);
	}

	exec = () => this.propositionsTypeRoute.exec();
}
