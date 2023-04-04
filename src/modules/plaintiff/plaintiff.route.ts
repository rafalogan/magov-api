import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { PlaintiffController } from './plaintiff.controller';

export class PlaintiffRoute extends Routes {
	constructor(options: RouteOptions, private plaintiffController: PlaintiffController) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/plaintiffs')
			.all(this.auth?.exec().authenticate())
			.get(this.plaintiffController.list.bind(this.plaintiffController))
			.post(this.plaintiffController.save.bind(this.plaintiffController))
			.all(methodNotAllowed);

		this.app
			.route('/plaintiffs/:id')
			.all(this.auth?.exec().authenticate())
			.get(this.plaintiffController.list.bind(this.plaintiffController))
			.put(this.plaintiffController.edit.bind(this.plaintiffController))
			.delete(this.plaintiffController.remove.bind(this.plaintiffController));
	}
}
