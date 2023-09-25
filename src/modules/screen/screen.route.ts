import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { ScreenController } from './screen.controller';

export class ScreenRoute extends Routes {
	constructor(
		options: RouteOptions,
		private screenController: ScreenController
	) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/screens')
			.all(this.auth?.exec().authenticate())
			.get(this.screenController.list.bind(this.screenController))
			.post(this.screenController.save.bind(this.screenController))
			.all(methodNotAllowed);

		this.app
			.route('/screens/:id')
			.all(this.auth?.exec().authenticate())
			.get(this.screenController.list.bind(this.screenController))
			.put(this.screenController.edit.bind(this.screenController))
			.delete(this.screenController.remove.bind(this.screenController))
			.all(methodNotAllowed);
	}
}
