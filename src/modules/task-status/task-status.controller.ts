import { BAD_REQUEST } from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { existsOrError, isRequired } from 'src/utils';
import { TaskStatusService } from 'src/services';
import { ResponseHandle } from 'src/core/handlers';
import { TaskStatus } from 'src/repositories/entities';

export class TaskStatusController extends Controller {
	constructor(private taskStatusService: TaskStatusService) {
		super();
	}

	save(req: Request, res: Response) {
		try {
			this.statusValidate(req);
		} catch (err: any) {
			return ResponseHandle.onError({ res, err });
		}

		const status = new TaskStatus(req.body);

		this.taskStatusService
			.save(status, req)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	edit(req: Request, res: Response) {
		const { id } = req.params;

		const status = new TaskStatus(req.body, Number(id));

		this.taskStatusService
			.save(status, req)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	list(req: Request, res: Response) {
		const { id } = req.params;

		this.taskStatusService
			.read(Number(id))
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	remove(req: Request, res: Response) {
		const { id } = req.params;

		this.taskStatusService
			.delete(Number(id), req)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	private statusValidate(req: Request) {
		const { status } = req.body;

		existsOrError(status, { message: isRequired('status'), status: BAD_REQUEST });
	}
}
