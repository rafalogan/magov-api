import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { UserLogController } from './user-log.controller';

export class UserLogRoute extends Routes {
	constructor(
		options: RouteOptions,
		private userLogController: UserLogController
	) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/user-log')
			.all(this.auth?.exec().authenticate())
			.get(this.userLogController.list.bind(this.userLogController))
			.all(methodNotAllowed);
	}
}
