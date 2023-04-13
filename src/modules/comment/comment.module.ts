import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { CommentController } from './comment.controller';
import { CommentRoute } from './comment.route';
import { CommentService } from 'src/services';

export class CommentModule extends CommonModule {
	private readonly commentController: CommentController;
	private commentRoute: CommentRoute;

	constructor(options: ModuleOptions<CommentService>) {
		super();

		this.commentController = new CommentController(options.service);
		this.commentRoute = new CommentRoute(options, this.commentController);
	}

	exec = () => this.commentRoute.exec();
}
