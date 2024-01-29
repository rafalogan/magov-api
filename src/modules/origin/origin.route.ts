import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { OriginController } from './origin.controller';

export class OriginRoute extends Routes {
	constructor(
		options: RouteOptions,
		private originController: OriginController
	) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/origins')
			.all(this.auth?.exec().authenticate())
			.get(this.originController.list.bind(this.originController))
			.all(methodNotAllowed);

		this.app
			.route('/origins/:id')
			.all(this.auth?.exec().authenticate())
			.get(this.originController.list.bind(this.originController))
			.all(methodNotAllowed);
	}
}
