import { Multer } from 'multer';

import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { PropositionController } from 'src/modules/proposition';

export class PropositionRoute extends Routes {
	constructor(options: RouteOptions, private propositionController: PropositionController, private upload: Multer) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/propositions')
			.all(this.auth?.exec().authenticate())
			.get(this.propositionController.list.bind(this.propositionController))
			.post(this.upload.single('file'), this.propositionController.save.bind(this.propositionController))
			.all(methodNotAllowed);

		this.app
			.route('/propositions/favorite/:id')
			.all(this.auth?.exec().authenticate())
			.get(this.propositionController.favorite.bind(this.propositionController))
			.all(methodNotAllowed);

		this.app
			.route('/propositions/add-url/:id')
			.all(this.auth?.exec().authenticate())
			.put(this.propositionController.addUrl.bind(this.propositionController))
			.all(methodNotAllowed);

		this.app
			.route('/propositions/:id')
			.all(this.auth?.exec().authenticate())
			.get(this.propositionController.list.bind(this.propositionController))
			.put(this.upload.single('file'), this.propositionController.edit.bind(this.propositionController))
			.delete(this.propositionController.remove.bind(this.propositionController))
			.all(methodNotAllowed);
	}
}
