import { BAD_REQUEST } from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { existsOrError, isRequired } from 'src/utils';
import { ScreenService } from 'src/services';
import { ResponseHandle } from 'src/core/handlers';
import { AppScreen } from 'src/repositories/entities';

export class ScreenController extends Controller {
	constructor(private screenService: ScreenService) {
		super();
	}

	save(req: Request, res: Response) {
		try {
			this.verify(req);
		} catch (err) {
			return ResponseHandle.onError({ res, err });
		}

		const screen = new AppScreen({ ...req.body, active: true });

		this.screenService.save(screen, req)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }))
	}

	edit(req: Request, res: Response) {
		const { id } = req.params;
		const screen = new AppScreen({ ...req.body }, Number(id));

		this.screenService.save(screen, req)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }))
	}

	list(req: Request, res: Response) {
		const { id } = req.params;

		this.screenService.read(Number(id))
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	remove(req: Request, res: Response) {
		const { id } = req.params;

		this.screenService.delete(Number(id))
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	private verify(req: Request) {
		const { code, name } = req.body;

		existsOrError(code, { message: isRequired('code'), status: BAD_REQUEST });
		existsOrError(name, { message: isRequired('name'), status: BAD_REQUEST });
	}
}
