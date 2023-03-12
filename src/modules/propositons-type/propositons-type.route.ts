import { Multer } from 'multer';

import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { PropositonsTypeController } from './propositons-type.controller';

export class PropositonsTypeRoute extends Routes {
	constructor(options: RouteOptions, private upload: Multer, private propositonsTypeController: PropositonsTypeController) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/types')
			.all(this.auth?.exec().authenticate())
			.get(this.propositonsTypeController.list.bind(this.propositonsTypeController))
			.post(this.upload.single('file'), this.propositonsTypeController.save.bind(this.propositonsTypeController))
			.all(methodNotAllowed);

		this.app
			.route('/types/:id')
			.all(this.auth?.exec().authenticate())
			.get(this.propositonsTypeController.list.bind(this.propositonsTypeController))
			.put(this.upload.single('file'), this.propositonsTypeController.edit.bind(this.propositonsTypeController))
			.delete(this.propositonsTypeController.remove.bind(this.propositonsTypeController))
			.all(methodNotAllowed);
	}
}
