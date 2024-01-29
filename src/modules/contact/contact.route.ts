import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { ContactController } from './contact.controller';

export class ContactRoute extends Routes {
	constructor(
		options: RouteOptions,
		private contactController: ContactController
	) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/contacts')
			.all(this.auth?.exec().authenticate())
			.get(this.contactController.list.bind(this.contactController))
			.all(methodNotAllowed);

		this.app
			.route('/contacts/:id')
			.all(this.auth?.exec().authenticate())
			.get(this.contactController.list.bind(this.contactController))
			.all(methodNotAllowed);
	}
}
