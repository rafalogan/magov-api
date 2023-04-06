import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { SupplierController } from './supplier.controller';

export class SupplierRoute extends Routes {
	constructor(options: RouteOptions, private supplierController: SupplierController) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/suppliers')
			.all(this.auth?.exec().authenticate())
			.get(this.supplierController.list.bind(this.supplierController))
			.post(this.supplierController.save.bind(this.supplierController))
			.all(methodNotAllowed);

		this.app
			.route('/suppliers/:id')
			.all(this.auth?.exec().authenticate())
			.get(this.supplierController.list.bind(this.supplierController))
			.put(this.supplierController.edit.bind(this.supplierController))
			.all(methodNotAllowed);
	}
}
