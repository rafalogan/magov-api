import { methodNotAllowed, Routes } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { TaskStatusController } from './task-status.controller';

export class TaskStatusRoute extends Routes {
	constructor(
		options: RouteOptions,
		private taskStatusController: TaskStatusController
	) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/tasks/status')
			.all(this.auth?.exec().authenticate())
			.get(this.taskStatusController.list.bind(this.taskStatusController))
			.post(this.taskStatusController.save.bind(this.taskStatusController))
			.all(methodNotAllowed);

		this.app
			.route('/tasks/status/:id')
			.all(this.auth?.exec().authenticate())
			.get(this.taskStatusController.list.bind(this.taskStatusController))
			.put(this.taskStatusController.edit.bind(this.taskStatusController))
			.delete(this.taskStatusController.remove.bind(this.taskStatusController))
			.all(methodNotAllowed);
	}
}
