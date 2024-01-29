import { Multer } from 'multer';

import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { UnitExpenseController } from './unit-expense.controller';

export class UnitExpenseRoute extends Routes {
	constructor(
		options: RouteOptions,
		private unitExpenseController: UnitExpenseController,
		private upload: Multer
	) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/unit-expenses')
			.all(this.auth?.exec().authenticate())
			.get(this.unitExpenseController.list.bind(this.unitExpenseController))
			.post(this.upload.single('file'), this.unitExpenseController.save.bind(this.unitExpenseController))
			.all(methodNotAllowed);

		this.app
			.route('/unit-expenses/:id')
			.all(this.auth?.exec().authenticate())
			.get(this.unitExpenseController.list.bind(this.unitExpenseController))
			.put(this.upload.single('file'), this.unitExpenseController.edit.bind(this.unitExpenseController))
			.delete(this.unitExpenseController.remove.bind(this.unitExpenseController))
			.all(methodNotAllowed);
	}
}
