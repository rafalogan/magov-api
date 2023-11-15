import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { MessageController } from './message.controller';
import { MessageRoute } from './message.route';
import { MessageTriggerService } from 'src/services';

export class MessageModule extends CommonModule {
	private readonly messageController: MessageController;
	private messageRoute: MessageRoute;

	constructor(options: ModuleOptions<MessageTriggerService>) {
		super();

		this.messageController = new MessageController(options.service);
		this.messageRoute = new MessageRoute(options, this.messageController);
	}

	exec = () => this.messageRoute.exec();
}
