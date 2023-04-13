import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { SaleController } from './sale.controller';
import { Multer } from 'multer';

export class SaleRoute extends Routes {
	constructor(options: RouteOptions, private saleController: SaleController, private upload: Multer) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/sales')
			.all(this.auth?.exec().authenticate())
			.get(this.saleController.list.bind(this.saleController))
			.post(this.upload.single('file'), this.saleController.save.bind(this.saleController))
			.all(methodNotAllowed);

		this.app
			.route('/sales/payments')
			.all(this.auth?.exec().authenticate())
			.get(this.saleController.listPayments.bind(this.saleController))
			.post(this.saleController.savePayment.bind(this.saleController))
			.all(methodNotAllowed);

		this.app
			.route('/sales/payments/:id')
			.all(this.auth?.exec().authenticate())
			.get(this.saleController.listPayments.bind(this.saleController))
			.put(this.saleController.editPayment.bind(this.saleController))
			.delete(this.saleController.removePayment.bind(this.saleController))
			.all(methodNotAllowed);

		this.app
			.route('/sales/:id')
			.all(this.auth?.exec().authenticate())
			.get(this.saleController.list.bind(this.saleController))
			.put(this.upload.single('file'), this.saleController.edit.bind(this.saleController))
			.delete(this.saleController.remove.bind(this.saleController))
			.all(methodNotAllowed);
	}
}
