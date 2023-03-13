import { Multer } from 'multer';

import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { RevenueController } from './revenue.controller';

export class RevenueRoute extends Routes {
	constructor(options: RouteOptions, private upload: Multer, private revenueController: RevenueController) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/revenues')
			.all(this.auth?.exec().authenticate())
			.get(this.revenueController.list.bind(this.revenueController))
			.post(this.upload.single('file'), this.revenueController.save.bind(this.revenueController))
			.all(methodNotAllowed);

		this.app
			.route('/revenues/:id')
			.all(this.auth?.exec().authenticate())
			.get(this.revenueController.list.bind(this.revenueController))
			.put(this.upload.single('file'), this.revenueController.edit.bind(this.revenueController))
			.delete(this.revenueController.remove.bind(this.revenueController))
			.all(methodNotAllowed);
	}
}
