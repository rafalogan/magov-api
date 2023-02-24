import { CommonModule } from 'src/core/modules';
import { AuthModuleOptions } from 'src/repositories/types';
import { AuthService } from 'src/services';
import { AuthController } from './auth.controller';
import { AuthRoutes } from './auth.routes';

export class AuthModule extends CommonModule {
	private readonly authController: AuthController;
	private authRoute: AuthRoutes;

	constructor(options: AuthModuleOptions<AuthService>) {
		super();

		this.authController = new AuthController(options.service);
		this.authRoute = new AuthRoutes({ ...options }, options.upload, this.authController);
	}

	exec = () => this.authRoute.exec();
}
