import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { DemandController } from './demand.controller';

export class DemandRoute extends Routes {
	constructor(
		options: RouteOptions,
		private demandController: DemandController
	) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/demands')
			.all(this.auth?.exec().authenticate())
			.get(this.demandController.list.bind(this.demandController))
			.post(this.demandController.save.bind(this.demandController))
			.all(methodNotAllowed);

		this.app
			.route('/demands/favorite/:id')
			.all(this.auth?.exec().authenticate())
			.get(this.demandController.favorite.bind(this.demandController))
			.all(methodNotAllowed);

		this.app
			.route('/demands/:id')
			.all(this.auth?.exec().authenticate())
			.get(this.demandController.list.bind(this.demandController))
			.put(this.demandController.edit.bind(this.demandController))
			.delete(this.demandController.remove.bind(this.demandController))
			.all(methodNotAllowed);
	}
}
