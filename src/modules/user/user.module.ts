import { Multer } from 'multer';

import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { UserService } from 'src/services';
import { UserController } from './user.controller';
import { UserRoutes } from './user.route';

export class UserModule extends CommonModule {
	private readonly userController: UserController;
	private userRoutes: UserRoutes;

	constructor(options: ModuleOptions<UserService>, upload: Multer) {
		super();

		this.userController = new UserController(options.service);
		this.userRoutes = new UserRoutes({ ...options }, upload, this.userController);
	}

	exec = () => this.userRoutes.exec();
}
