import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { CommentController } from './comment.controller';

export class CommentRoute extends Routes {
	constructor(
		options: RouteOptions,
		private commentController: CommentController
	) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/comments')
			.all(this.auth?.exec().authenticate())
			.get(this.commentController.list.bind(this.commentController))
			.post(this.commentController.save.bind(this.commentController))
			.all(methodNotAllowed);

		this.app
			.route('/comments/:id')
			.all(this.auth?.exec().authenticate())
			.get(this.commentController.list.bind(this.commentController))
			.put(this.commentController.edit.bind(this.commentController))
			.delete(this.commentController.remove.bind(this.commentController))
			.all(methodNotAllowed);
	}
}
