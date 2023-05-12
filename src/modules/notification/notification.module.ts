import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { NotificationController } from './notification.controller';
import { NotificationRoute } from './notification.route';
import { NotificationService } from 'src/services';

export class NotificationModule extends CommonModule {
	private readonly notificationController: NotificationController;
	private notificationRoute: NotificationRoute;

	constructor(options: ModuleOptions<NotificationService>) {
		super();

		this.notificationController = new NotificationController(options.service);
		this.notificationRoute = new NotificationRoute(options, this.notificationController);
	}

	exec = () => this.notificationRoute.exec();
}
