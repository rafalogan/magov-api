import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { UnitController } from './unit.controller';

export class UnitRoute extends Routes {
	constructor(
		options: RouteOptions,
		private unitController: UnitController
	) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/units')
			.all(this.auth?.exec().authenticate())
			.get(this.unitController.list.bind(this.unitController))
			.post(this.unitController.save.bind(this.unitController))
			.all(methodNotAllowed);

		this.app
			.route('/units/:id')
			.all(this.auth?.exec().authenticate())
			.get(this.unitController.list.bind(this.unitController))
			.put(this.unitController.edit.bind(this.unitController))
			.delete(this.unitController.remove.bind(this.unitController))
			.all(methodNotAllowed);
	}
}
