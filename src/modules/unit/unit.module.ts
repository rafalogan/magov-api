import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { UnitService } from 'src/services';
import { UnitController } from './unit.controller';
import { UnitRoute } from './unit.route';

export class UnitModule extends CommonModule {
	private readonly unitController: UnitController;
	private unitRoute: UnitRoute;

	constructor(options: ModuleOptions<UnitService>) {
		super();

		this.unitController = new UnitController(options.service);
		this.unitRoute = new UnitRoute(options, this.unitController);
	}

	exec = () => this.unitRoute.exec();
}
