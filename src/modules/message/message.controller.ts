import {} from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { MessageTriggerService } from 'src/services';

export class MessageController extends Controller {
	constructor(private messageService: MessageTriggerService) {
		super();
	}

	save(req: Request, res: Response) {}

	saveHistory(req: Request, res: Response) {}

	edit(req: Request, res: Response) {}

	list(req: Request, res: Response) {}

	listHistory(req: Request, res: Response) {}

	remove(req: Request, res: Response) {}

	removeHistory(req: Request, res: Response) {}
}
