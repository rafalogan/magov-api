import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { TaskService } from 'src/services';
import { TaskController } from './task.controller';
import { TaskRoute } from './task.route';

export class TaskModule extends CommonModule {
	private readonly taskController: TaskController;
	private taskRoute: TaskRoute;

	constructor(options: ModuleOptions<TaskService>) {
		super();

		this.taskController = new TaskController(options.service);
		this.taskRoute = new TaskRoute(options, this.taskController);
	}

	exec = () => this.taskRoute.exec();
}
