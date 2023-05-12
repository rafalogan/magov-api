import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { NotificationController } from './notification.controller';

export class NotificationRoute extends Routes {
	constructor(options: RouteOptions, private notificationController: NotificationController) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/notifications/email')
			.all(this.auth?.exec().authenticate())
			.post(this.notificationController.sendMailNotify.bind(this.notificationController))
			.all(methodNotAllowed);
	}
}
