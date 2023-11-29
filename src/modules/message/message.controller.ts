import { BAD_REQUEST } from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { MessageTriggerService } from 'src/services';
import { existsOrError, isRequired } from 'src/utils';
import { ResponseHandle, getTenancyByToken } from 'src/core/handlers';
import { MessageHistory, MessageTrigger, SetMessageTrigger } from 'src/repositories/entities';

export class MessageController extends Controller {
	constructor(private messageService: MessageTriggerService) {
		super();
	}

	sendMessage(req: Request, res: Response) {
		try {
			this.validateSendMessage(req);
		} catch (err) {
			return ResponseHandle.onError({ res, err });
		}

		const mesageToSend = new SetMessageTrigger(req.body);

		this.messageService
			.triggerMessage(mesageToSend)
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
		const tenancyId = req.body.tenancyId || getTenancyByToken(req);

		for (const item of required) {
			existsOrError(req.body[item], { message: isRequired(item), status: BAD_REQUEST });
		}

		existsOrError(tenancyId, { message: isRequired('tenancyId'), status: BAD_REQUEST });
	}

	validateHistory(req: Request) {
		const required = ['message', 'sendDate'];
		const tenancyId = req.body.tenancyId || getTenancyByToken(req);

		for (const item in required) {
			existsOrError(req.body[item], { message: isRequired(item), status: BAD_REQUEST });
		}

		existsOrError(tenancyId, { message: isRequired('tenancyId'), status: BAD_REQUEST });
	}

	validateSendMessage(req: Request) {
		const { contacts, message } = req.body;
		const tenancyId = req.body.tenancyId || getTenancyByToken(req);

		existsOrError(contacts, { message: isRequired('contacts'), status: BAD_REQUEST });
		existsOrError(message, { message: isRequired('message'), status: BAD_REQUEST });
		existsOrError(tenancyId, { message: isRequired('tenancyId'), status: BAD_REQUEST });
	}
}
