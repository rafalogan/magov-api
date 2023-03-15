import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';

export class PropositionRoute extends Routes {
constructor(options: RouteOptions, private PropositionController:) {
	super(options.app, options.auth);
}

exec() {}
}
