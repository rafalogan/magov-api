import {} from 'http-status';
import { Request, Response } from 'express';

import { KeywordService } from 'src/services';
import { ResponseHandle } from 'src/core/handlers';

export class KeywordController {
	constructor(private keywordService: KeywordService) {}

	// save(req: Request, res: Response) { }

	// edit(req: Request, res: Response) {}

	list(req: Request, res: Response) {
		const { id } = req.params;

		this.keywordService
			.read(Number(id))
			.then(data => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err, message: err.message, status: err.status }));
	}

	remove(req: Request, res: Response) {
		const { id } = req.params;
		const filter = Number(id) || id;

		this.keywordService
			.delete(filter)
			.then((data: any) => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err, message: err.message }));
	}
}
