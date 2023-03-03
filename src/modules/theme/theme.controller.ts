import { BAD_REQUEST } from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { ThemeService } from 'src/services';
import { isRequired, notExistisOrError, requiredFields } from 'src/utils';
import { onLog, ResponseHandle } from 'src/core/handlers';
import { Theme } from 'src/repositories/entities';

export class ThemeController extends Controller {
	constructor(private themeService: ThemeService) {
		super();
	}

	save(req: Request, res: Response) {
		try {
			this.validateRequest(req);
		} catch (message: any) {
			return ResponseHandle.onError({ res, message, status: BAD_REQUEST });
		}
		const theme = new Theme(req.body);

		this.themeService
			.save(theme)
			.then(data => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, message: err.message, status: err.status }));
	}

	edit(req: Request, res: Response) {
		const { id } = req.params;
		const theme = new Theme(req.body, Number(id));

		this.themeService
			.save(theme)
			.then(data => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, message: err.message, err, status: err.status }));
	}

	list(req: Request, res: Response) {
		const { id } = req.params;
		const active = req.query?.active;
		const filter = Number(id) || id;

		onLog('filter to read', filter);

		this.themeService
			.read(filter, active)
			.then(data => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	remove(req: Request, res: Response) {
		const { id } = req.params;

		this.themeService
			.disable(Number(id))
			.then((data: any) => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	private validateRequest(req: Request) {
		const { name, active } = req.body;
		const requireds = requiredFields([
			{ field: name, message: 'name' },
			{ field: active, message: 'actve' },
		]);

		notExistisOrError(requireds, requireds?.map(m => isRequired(m)).join('\n') as string);
	}
}
