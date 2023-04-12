import {} from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { GovernmentRevenueService } from 'src/services';

export class GovernmentRevenueController extends Controller {
	constructor(private governmentRevenueService: GovernmentRevenueService) {
		super();
	}

	save(req: Request, res: Response) {}

	edit(req: Request, res: Response) {}

	list(req: Request, res: Response) {}

	remove(req: Request, res: Response) {}
}
