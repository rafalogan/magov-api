import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { SupplierController } from './supplier.controller';
import { SupplierRoute } from './supplier.route';
import { SupplierService } from 'src/services';

export class SupplierModule extends CommonModule {
	private readonly supplierController: SupplierController;
	private supplierRoute: SupplierRoute;

	constructor(options: ModuleOptions<SupplierService>) {
		super();

		this.supplierController = new SupplierController(options.service);
		this.supplierRoute = new SupplierRoute(options, this.supplierController);
	}

	exec = () => this.supplierRoute.exec();
}
