import { Multer } from 'multer';

import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { UserController } from './user.controller';

export class UserRoutes extends Routes {
	constructor(options: RouteOptions, private upload: Multer, private userController: UserController) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/users')
			.all(this.auth?.exec().authenticate())
			.get(this.userController.list.bind(this.userController))
			.post(this.upload.single('file'), this.userController.save.bind(this.userController))
			.all(methodNotAllowed);

		this.app
			.route('/users/:id')
			.all(this.auth?.exec().authenticate())
			.get(this.userController.list.bind(this.userController))
			.put(this.upload.single('file'), this.userController.edit.bind(this.userController))
			.delete(this.userController.remove.bind(this.userController))
			.all(methodNotAllowed);
	}
}
