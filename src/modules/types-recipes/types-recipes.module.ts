import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { TypesRecipesController } from './types-recipes.controller';
import { TypesRecipesRoute } from './types-recipes.route';
import { TypesRecipesService } from 'src/services';

export class TypesRecipesModule extends CommonModule {
	private readonly typesRecipesController: TypesRecipesController;
	private typesRecipesRoute: TypesRecipesRoute;

	constructor(options: ModuleOptions<TypesRecipesService>) {
		super();

		this.typesRecipesController = new TypesRecipesController(options.service);
		this.typesRecipesRoute = new TypesRecipesRoute(options, this.typesRecipesController);
	}

	exec = () => this.typesRecipesRoute.exec();
}
