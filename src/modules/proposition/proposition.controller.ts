import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { PropositionService } from 'src/services';

export class PropositionController extends Controller {
	constructor(private PropositionService: PropositionService) {
		super();
	}

	save(req: Request, res: Response) {}

	edit(req: Request, res: Response) {}

	list(req: Request, res: Response) {}

	remove(req: Request, res: Response) {}
}
