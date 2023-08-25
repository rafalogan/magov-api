import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { UserLogController } from './user-log.controller';
import { UserLogRoute } from './user-log.route';
import { UserLogService } from 'src/services';

export class UserLogModule extends CommonModule {
	private readonly userLogController: UserLogController;
	private userLogRoute: UserLogRoute;

	constructor(options: ModuleOptions<UserLogService>) {
		super();

		this.userLogController = new UserLogController(options.service);
		this.userLogRoute = new UserLogRoute(options, this.userLogController);
	}

	exec = () => this.userLogRoute.exec();
}
