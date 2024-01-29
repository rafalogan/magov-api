import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { ThemeController } from './theme.controller';

export class ThemeRoute extends Routes {
	constructor(
		options: RouteOptions,
		private themeController: ThemeController
	) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/themes')
			.all(this.auth?.exec().authenticate())
			.get(this.themeController.list.bind(this.themeController))
			.post(this.themeController.save.bind(this.themeController))
			.all(methodNotAllowed);

		this.app
			.route('/themes/:id')
			.all(this.auth?.exec().authenticate())
			.get(this.themeController.list.bind(this.themeController))
			.put(this.themeController.edit.bind(this.themeController))
			.delete(this.themeController.remove.bind(this.themeController))
			.all(methodNotAllowed);
	}
}
