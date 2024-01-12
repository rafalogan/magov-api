import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { ProfileController } from './profile.controller';

export class ProfileRoute extends Routes {
	constructor(
		options: RouteOptions,
		private profileController: ProfileController
	) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/profiles')
			.all(this.auth?.exec().authenticate())
			.get(this.profileController.list.bind(this.profileController))
			.post(this.profileController.save.bind(this.profileController))
			.all(methodNotAllowed);

		this.app
			.route('/profiles/disable/:filter')
			.all(this.auth?.exec().authenticate())
			.get(this.profileController.disable.bind(this.profileController))
			.all(methodNotAllowed);

		this.app
			.route('/profiles/:filter')
			.all(this.auth?.exec().authenticate())
			.get(this.profileController.list.bind(this.profileController))
			.put(this.profileController.edit.bind(this.profileController))
			.delete(this.profileController.remove.bind(this.profileController))
			.all(methodNotAllowed);
	}
}
