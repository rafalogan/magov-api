import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { MessageController } from './message.controller';

export class MessageRoute extends Routes {
	constructor(
		options: RouteOptions,
		private messageController: MessageController
	) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('message-trigger')
			.all(this.auth?.exec().authenticate())
			.get(this.messageController.list.bind(this.messageController))
			.post(this.messageController.sendMessage.bind(this.messageController))
			.all(methodNotAllowed);

		this.app
			.route('message-trigger/history')
			.all(this.auth?.exec().authenticate())
			.post(this.messageController.saveHistory.bind(this.messageController))
			.all(methodNotAllowed);

		this.app
			.route('message-trigger/history/:tenancyId')
			.all(this.auth?.exec().authenticate())
			.get(this.messageController.listHistory.bind(this.messageController))
			.delete(this.messageController.removeHistory.bind(this.messageController))
			.all(methodNotAllowed);

		this.app
			.route('message-trigger/:tenancyId')
			.all(this.auth?.exec().authenticate())
			.get(this.messageController.list.bind(this.messageController))
			.post(this.messageController.save.bind(this.messageController))
			.put(this.messageController.edit.bind(this.messageController))
			.delete(this.messageController.remove.bind(this.messageController))
			.all(methodNotAllowed);
	}
}
