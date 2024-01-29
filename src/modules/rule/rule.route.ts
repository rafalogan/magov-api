import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { RuleController } from './rule.controller';

export class RuleRoute extends Routes {
	constructor(
		options: RouteOptions,
		private ruleController: RuleController
	) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/rules')
			.all(this.auth?.exec().authenticate())
			.get(this.ruleController.list.bind(this.ruleController))
			.post(this.ruleController.save.bind(this.ruleController))
			.all(methodNotAllowed);

		this.app
			.route('/rules/:id')
			.all(this.auth?.exec().authenticate())
			.get(this.ruleController.list.bind(this.ruleController))
			.put(this.ruleController.edit.bind(this.ruleController))
			.delete(this.ruleController.remove.bind(this.ruleController))
			.all(methodNotAllowed);
	}
}
