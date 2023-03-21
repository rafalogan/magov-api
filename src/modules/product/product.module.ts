import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { ProductController } from './product.controller';
import { ProductRoute } from './product.route';
import { ProductService } from 'src/services';

export class ProductModule extends CommonModule {
	private readonly productController: ProductController;
	private productRoute: ProductRoute;

	constructor(options: ModuleOptions<ProductService>) {
		super();

		this.productController = new ProductController(options.service);
		this.productRoute = new ProductRoute(options, this.productController);
	}

	exec = () => this.productRoute.exec();
}
