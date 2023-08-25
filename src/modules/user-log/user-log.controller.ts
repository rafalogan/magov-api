import {} from 'http-status';
import { Request, Response } from 'express';

import { UserLogService } from 'src/services';
import { ResponseHandle, getTenancyByToken } from 'src/core/handlers';
import { ReadUserlogOptionsModel } from 'src/repositories/models';

export class UserLogController {
	constructor(private userLogService: UserLogService) {}

	list(req: Request, res: Response) {
		const tenancyId = Number(req.query.tenancyId) || getTenancyByToken(req);
		const options = new ReadUserlogOptionsModel({ ...req.query, tenancyId });

		this.userLogService
			.read(options)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}
}
