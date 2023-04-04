import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { GovernmentExpensesController } from './government-expenses.controller';

export class GovernmentExpensesRoute extends Routes {
	constructor(options: RouteOptions, private governmentExpensesController: GovernmentExpensesController) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/government-expenses')
			.all(this.auth?.exec().authenticate())
			.get(this.governmentExpensesController.list.bind(this.governmentExpensesController))
			.post(this.governmentExpensesController.save.bind(this.governmentExpensesController))
			.all(methodNotAllowed);

		this.app
			.route('/government-expenses/:id')
			.all(this.auth?.exec().authenticate())
			.get(this.governmentExpensesController.list.bind(this.governmentExpensesController))
			.put(this.governmentExpensesController.edit.bind(this.governmentExpensesController))
			.delete(this.governmentExpensesController.remove.bind(this.governmentExpensesController))
			.all(methodNotAllowed);
	}
}
