import { BAD_REQUEST } from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { InstituteTypeService } from 'src/services';
import { existsOrError, isRequired } from 'src/utils';
import { ResponseHandle } from 'src/core/handlers';
import { InstituteType } from 'src/repositories/entities';

export class InstituteTypeController extends Controller {
	constructor(private instituteTypeService: InstituteTypeService) {
		super();
	}

	async save(req: Request, res: Response) {
		try {
			this.verifyRequired(req);
		} catch (err) {
			return ResponseHandle.onError({ res, err });
		}

		const instituteType = new InstituteType({ ...req.body, active: req.body.active || true });

		this.instituteTypeService
			.save(instituteType, req)
			.then(data => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	edit(req: Request, res: Response) {
		const { id } = req.params;
		const instituteType = new InstituteType(req.body, Number(id));

		this.instituteTypeService
			.save(instituteType, req)
			.then(data => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	list(req: Request, res: Response) {
		const { id } = req.params;

		this.instituteTypeService
			.read(Number(id))
			.then(data => ResponseHandle.onSuccess({ res, data, status: data?.status }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	remove(req: Request, res: Response) {
		const { id } = req.params;

		this.instituteTypeService
			.disable(Number(id))
			.then((data: any) => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	async verifyRequired(req: Request) {
		const { name } = req.body;
		existsOrError(name, { message: isRequired('name'), status: BAD_REQUEST });
	}
}
