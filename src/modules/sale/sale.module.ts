import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { SaleController } from './sale.controller';
import { SaleRoute } from './sale.route';
import { SaleService } from 'src/services';
import { Multer } from 'multer';

export class SaleModule extends CommonModule {
	private readonly saleController: SaleController;
	private saleRoute: SaleRoute;

	constructor(options: ModuleOptions<SaleService>, upload: Multer) {
		super();

		this.saleController = new SaleController(options.service);
		this.saleRoute = new SaleRoute(options, this.saleController, upload);
	}

	exec = () => this.saleRoute.exec();
}
