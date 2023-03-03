import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { KeywordController } from './keyword.controller';

export class KeywordRoute extends Routes {
	constructor(options: RouteOptions, private keywordController: KeywordController) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/keywords')
			.all(this.auth?.exec().authenticate())
			.get(this.keywordController.list.bind(this.keywordController))
			.all(methodNotAllowed);

		this.app
			.route('/keywords/:id')
			.all(this.auth?.exec().authenticate())
			.get(this.keywordController.list.bind(this.keywordController))
			.delete(this.keywordController.remove.bind(this.keywordController))
			.all(methodNotAllowed);
	}
}
