import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { PropositionService } from 'src/services';
import { PropositionController, PropositionRoute } from 'src/modules/proposition';

export class PropositionModule extends CommonModule {
	private readonly propositionController: PropositionController;
	private propositionRoute: PropositionRoute;

	constructor(options: ModuleOptions<PropositionService>) {
		super();

		this.propositionController = new PropositionController(options.service);
		this.propositionRoute = new PropositionRoute(options, this.propositionController);
	}

	exec = () => this.propositionRoute.exec();
}
