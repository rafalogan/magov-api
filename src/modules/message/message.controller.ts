import { BAD_REQUEST } from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { MessageTriggerService } from 'src/services';
import { existsOrError, isRequired } from 'src/utils';
import { ResponseHandle } from 'src/core/handlers';
import { MessageTrigger } from 'src/repositories/entities';

export class MessageController extends Controller {
	constructor(private messageService: MessageTriggerService) {
		super();
	}

	save(req: Request, res: Response) {
		try {
			this.validate(req);
		} catch (err: any) {
			return ResponseHandle.onError({ res, err });
		}

		const trrigers = new MessageTrigger(req.body);

		this.messageService
			.save(trrigers, req)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	saveHistory(req: Request, res: Response) {}

	edit(req: Request, res: Response) {}

	list(req: Request, res: Response) {}

	listHistory(req: Request, res: Response) {}

	remove(req: Request, res: Response) {}

	removeHistory(req: Request, res: Response) {}

	validate(req: Request) {
		const required = ['tenancyId', 'triggers', 'dueDate'];

		for (const item of required) {
			existsOrError(req.body[item], { message: isRequired(item), status: BAD_REQUEST });
		}
	}
}
