import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { TaskController } from './task.controller';

export class TaskRoute extends Routes {
	constructor(
		options: RouteOptions,
		private taskController: TaskController
	) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/tasks')
			.all(this.auth?.exec().authenticate())
			.get(this.taskController.list.bind(this.taskController))
			.post(this.taskController.save.bind(this.taskController))
			.all(methodNotAllowed);

		this.app
			.route('/tasks/:id')
			.all(this.auth?.exec().authenticate())
			.get(this.taskController.list.bind(this.taskController))
			.put(this.taskController.edit.bind(this.taskController))
			.delete(this.taskController.remove.bind(this.taskController))
			.all(methodNotAllowed);
	}
}
