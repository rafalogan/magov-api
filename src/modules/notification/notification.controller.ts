import { BAD_REQUEST } from 'http-status';
import { Request, Response } from 'express';

import { existsOrError, isRequired, requiredFields } from 'src/utils';
import { NotificationService } from 'src/services';
import { ResponseHandle } from 'src/core/handlers';
import { NotificationEntry } from 'src/repositories/entities';

export class NotificationController {
	constructor(private notificationService: NotificationService) {}

	sendMailNotify(req: Request, res: Response) {
		try {
			this.validateMailNotification(req);
		} catch (err) {
			return ResponseHandle.onError({ res, err });
		}

		const data = new NotificationEntry(req.body);

		this.notificationService
			.emailNotificate(data)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	private validateMailNotification(req: Request) {
		const { to, subject, message, from } = req.body;

		const requireds = requiredFields([
			{ field: to, message: isRequired('to') },
			{ field: subject, message: isRequired('subject') },
			{ field: message, message: isRequired('message') },
			{ field: from, message: isRequired('from') },
		]);

		existsOrError(requireds, { message: requireds?.join('\n '), status: BAD_REQUEST });
	}
}
