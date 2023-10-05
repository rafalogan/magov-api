import {} from 'http-status';
import { Request, Response } from 'express';

import { ContactService } from 'src/services';
import { getTenancyByToken, ResponseHandle } from 'src/core/handlers';
import { ReadOptionsModel } from 'src/repositories/models';

export class ContactController {
	constructor(private contactService: ContactService) {}

	// save(req: Request, res: Response) {}

	// edit(req: Request, res: Response) {}

	list(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = Number(req.query.tenancyId) || getTenancyByToken(req);
		const options = new ReadOptionsModel({ ...req.query, tenancyId });

		this.contactService
			.read(options, Number(id))
			.then((data: any) => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	// remove(req: Request, res: Response) {}
}
