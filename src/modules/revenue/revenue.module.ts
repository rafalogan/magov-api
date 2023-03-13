import { Multer } from 'multer';

import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { RevenueService } from 'src/services';
import { RevenueController } from './revenue.controller';
import { RevenueRoute } from './revenue.route';

export class RevenueModule extends CommonModule {
	private readonly revenueController: RevenueController;
	private revenueRoute: RevenueRoute;

	constructor(options: ModuleOptions<RevenueService>, upload: Multer) {
		super();

		this.revenueController = new RevenueController(options.service);
		this.revenueRoute = new RevenueRoute(options, upload, this.revenueController);
	}

	exec = () => this.revenueRoute.exec();
}
