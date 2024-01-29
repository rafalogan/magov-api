import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { TypesRecipesController } from './types-recipes.controller';

export class TypesRecipesRoute extends Routes {
	constructor(
		options: RouteOptions,
		private typesRecipesController: TypesRecipesController
	) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/types-recipes')
			.all(this.auth?.exec().authenticate())
			.get(this.typesRecipesController.list.bind(this.typesRecipesController))
			.post(this.typesRecipesController.save.bind(this.typesRecipesController))
			.all(methodNotAllowed);

		this.app
			.route('/types-recipes/:id')
			.all(this.auth?.exec().authenticate())
			.get(this.typesRecipesController.list.bind(this.typesRecipesController))
			.put(this.typesRecipesController.edit.bind(this.typesRecipesController))
			.delete(this.typesRecipesController.remove.bind(this.typesRecipesController))
			.all(methodNotAllowed);
	}
}
