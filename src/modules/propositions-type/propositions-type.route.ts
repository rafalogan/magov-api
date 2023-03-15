import { Multer } from 'multer';

import { methodNotAllowed, Routes } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { PropositionsTypeController } from './Propositions-type.controller';

export class PropositionsTypeRoute extends Routes {
	constructor(options: RouteOptions, private upload: Multer, private PropositionsTypeController: PropositionsTypeController) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/types')
			.all(this.auth?.exec().authenticate())
			.get(this.PropositionsTypeController.list.bind(this.PropositionsTypeController))
			.post(this.upload.single('file'), this.PropositionsTypeController.save.bind(this.PropositionsTypeController))
			.all(methodNotAllowed);

		this.app
			.route('/types/:id')
			.all(this.auth?.exec().authenticate())
			.get(this.PropositionsTypeController.list.bind(this.PropositionsTypeController))
			.put(this.upload.single('file'), this.PropositionsTypeController.edit.bind(this.PropositionsTypeController))
			.delete(this.PropositionsTypeController.remove.bind(this.PropositionsTypeController))
			.all(methodNotAllowed);
	}
}
