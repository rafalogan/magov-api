import { BAD_REQUEST } from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { MessageTriggerService } from 'src/services';
import { existsOrError, isRequired } from 'src/utils';
import { ResponseHandle } from 'src/core/handlers';
import { MessageHistory, MessageTrigger } from 'src/repositories/entities';

export class MessageController extends Controller {
	constructor(private messageService: MessageTriggerService) {
		super();
	}

	sendMessage(req: Request, res: Response) {
		try {
			this.validateHistory(req);
		} catch (err) {
			return ResponseHandle.onError({ res, err });
		}

		const mesageToSend = new MessageHistory(req.body);

		this.messageService
			.createHistory(mesageToSend)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
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

	saveHistory(req: Request, res: Response) {
		try {
			this.validateHistory(req);
		} catch (err) {
			return ResponseHandle.onError({ err, res });
		}

		const history = new MessageHistory(req.body);

		this.messageService
			.createHistory(history)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	edit(req: Request, res: Response) {
		const { tenancyId } = req.params;

		const trigger = new MessageTrigger(req.body);

		this.messageService
			.update(trigger, Number(tenancyId), req)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	list(req: Request, res: Response) {
		const { tenancyId } = req.params;

		this.messageService
			.read({ tenancyId: Number(tenancyId) })
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	listHistory(req: Request, res: Response) {
		const { tenancyId } = req.params;

		this.messageService
			.findHistory(Number(tenancyId))
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	remove(req: Request, res: Response) {
		const { tenancyId } = req.params;

		this.messageService
			.delete(Number(tenancyId))
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	removeHistory(req: Request, res: Response) {
		const { tenancyId } = req.params;

		this.messageService
			.deletedHistories(Number(tenancyId))
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	validate(req: Request) {
		const required = ['tenancyId', 'triggers', 'dueDate'];

		for (const item of required) {
			existsOrError(req.body[item], { message: isRequired(item), status: BAD_REQUEST });
		}
	}

	validateHistory(req: Request) {
		const required = ['tenancyId', 'message', 'sendDate'];

		for (const item in required) {
			existsOrError(req.body[item], { message: isRequired(item), status: BAD_REQUEST });
		}
	}
}
