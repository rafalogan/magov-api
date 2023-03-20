import { Multer } from 'multer';

import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { UnitExpenseController } from './unit-expense.controller';
import { UnitExpenseRoute } from './unit-expense.route';
import { UnitExpenseService } from 'src/services';

export class UnitExpenseModule extends CommonModule {
	private readonly unitExpenseController: UnitExpenseController;
	private unitExpenseRoute: UnitExpenseRoute;

	constructor(options: ModuleOptions<UnitExpenseService>, upload: Multer) {
		super();

		this.unitExpenseController = new UnitExpenseController(options.service);
		this.unitExpenseRoute = new UnitExpenseRoute(options, this.unitExpenseController, upload);
	}

	exec = () => this.unitExpenseRoute.exec();
}
