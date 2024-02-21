import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { TaskStatusController } from './task-status.controller';
import { TaskStatusRoute } from './task-status.route';
import { TaskStatusService } from 'src/services';

export class TaskStatusModule extends CommonModule {
	private readonly taskStatusController: TaskStatusController;
	private taskStatusRoute: TaskStatusRoute;

	constructor(options: ModuleOptions<TaskStatusService>) {
		super();

		this.taskStatusController = new TaskStatusController(options.service);
		this.taskStatusRoute = new TaskStatusRoute(options, this.taskStatusController);
	}

	exec = () => this.taskStatusRoute.exec();
}
