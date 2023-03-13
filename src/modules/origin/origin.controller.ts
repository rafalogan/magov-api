import { Request, Response } from 'express';

import { OriginService } from 'src/services';
import { ResponseHandle } from 'src/core/handlers';

export class OriginController {
	constructor(private originService: OriginService) {}

	// save(req: Request, res: Response) {}

	// edit(req: Request, res: Response) {}

	list(req: Request, res: Response) {
		const { id } = req.params;

		this.originService
			.read(Number(id))
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	// remove(req: Request, res: Response) {}
}
