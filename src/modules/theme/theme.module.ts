import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { ThemeService } from 'src/services';
import { ThemeController } from './theme.controller';
import { ThemeRoute } from './theme.route';

export class ThemeModule extends CommonModule {
	private readonly themeController: ThemeController;
	private themeRoute: ThemeRoute;

	constructor(options: ModuleOptions<ThemeService>) {
		super();

		this.themeController = new ThemeController(options.service);
		this.themeRoute = new ThemeRoute(options, this.themeController);
	}

	exec = () => this.themeRoute.exec();
}
