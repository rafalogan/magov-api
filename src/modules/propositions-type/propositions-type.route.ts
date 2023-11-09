import { Multer } from 'multer';

import { methodNotAllowed, Routes } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { PropositionsTypeController } from './propositions-type.controller';

export class PropositionsTypeRoute extends Routes {
	constructor(
		options: RouteOptions,
		private upload: Multer,
		private propositionsTypeController: PropositionsTypeController
	) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/types')
			.all(this.auth?.exec().authenticate())
			.get(this.propositionsTypeController.list.bind(this.propositionsTypeController))
			.post(this.upload.single('file'), this.propositionsTypeController.save.bind(this.propositionsTypeController))
			.all(methodNotAllowed);

		this.app
			.route('/types/propositions')
			.all(this.auth?.exec().authenticate())
			.get(this.propositionsTypeController.listPropsFiles.bind(this.propositionsTypeController))
			.all(methodNotAllowed);

		this.app
			.route('/types/:id')
			.all(this.auth?.exec().authenticate())
			.get(this.propositionsTypeController.list.bind(this.propositionsTypeController))
			.put(this.upload.single('file'), this.propositionsTypeController.edit.bind(this.propositionsTypeController))
			.delete(this.propositionsTypeController.remove.bind(this.propositionsTypeController))
			.all(methodNotAllowed);
	}
}
