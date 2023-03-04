import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { InstituteTypeController } from './institute-type.controller';

export class InstituteTypeRoute extends Routes {
	constructor(options: RouteOptions, private instituteTypeController: InstituteTypeController) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/institutes-types')
			.all(this.auth?.exec().authenticate())
			.post(this.instituteTypeController.save.bind(this.instituteTypeController))
			.get(this.instituteTypeController.list.bind(this.instituteTypeController))
			.all(methodNotAllowed);

		this.app
			.route('/institutes-types/:id')
			.all(this.auth?.exec().authenticate())
			.get(this.instituteTypeController.list.bind(this.instituteTypeController))
			.put(this.instituteTypeController.edit.bind(this.instituteTypeController))
			.delete(this.instituteTypeController.remove.bind(this.instituteTypeController))
			.all(methodNotAllowed);
	}
}
