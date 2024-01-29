import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { ProductController } from './product.controller';

export class ProductRoute extends Routes {
	constructor(
		options: RouteOptions,
		private productController: ProductController
	) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/products')
			.get(this.productController.list.bind(this.productController))
			.all(this.auth?.exec().authenticate())
			.post(this.productController.save.bind(this.productController))
			.all(methodNotAllowed);

		this.app
			.route('/products/:id')
			.get(this.productController.list.bind(this.productController))
			.all(this.auth?.exec().authenticate())
			.put(this.productController.edit.bind(this.productController))
			.delete(this.productController.remove.bind(this.productController))
			.all(methodNotAllowed);
	}
}
