import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { PlanController } from './plan.controller';

export class PlanRoute extends Routes {
	constructor(
		options: RouteOptions,
		private planController: PlanController
	) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/plans')
			.get(this.planController.list.bind(this.planController))
			.all(this.auth?.exec().authenticate())
			.post(this.planController.save.bind(this.planController))
			.all(methodNotAllowed);

		this.app
			.route('/plans/:id')
			.get(this.planController.list.bind(this.planController))
			.all(this.auth?.exec().authenticate())
			.put(this.planController.edit.bind(this.planController))
			.delete(this.planController.remove.bind(this.planController))
			.all(methodNotAllowed);
	}
}
