import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { GovernmentRevenueController } from './government-revenue.controller';

export class GovernmentRevenueRoute extends Routes {
	constructor(
		options: RouteOptions,
		private governmentRevenueController: GovernmentRevenueController
	) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/government-revenues')
			.all(this.auth?.exec().authenticate())
			.get(this.governmentRevenueController.list.bind(this.governmentRevenueController))
			.post(this.governmentRevenueController.save.bind(this.governmentRevenueController))
			.all(methodNotAllowed);

		this.app
			.route('/government-revenues/:id')
			.all(this.auth?.exec().authenticate())
			.get(this.governmentRevenueController.list.bind(this.governmentRevenueController))
			.put(this.governmentRevenueController.edit.bind(this.governmentRevenueController))
			.delete(this.governmentRevenueController.remove.bind(this.governmentRevenueController))
			.all(methodNotAllowed);
	}
}
