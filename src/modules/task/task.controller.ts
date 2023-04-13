import { BAD_REQUEST } from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { TaskService } from 'src/services';
import { getTenancyByToken, ResponseHandle } from 'src/core/handlers';
import { isRequired, notExistisOrError, requiredFields } from 'src/utils';
import { ReadOptionsModel, TaskModel } from 'src/repositories/models';

export class TaskController extends Controller {
	constructor(private taskService: TaskService) {
		super();
	}

	save(req: Request, res: Response) {
		try {
			this.validateRequest(req);
		} catch (err) {
			return ResponseHandle.onError({ res, err });
		}
		const tenancyId = getTenancyByToken(req) || Number(req.body.tenancyId);
		const userId = Number(req.body.userId || req.body.users[0]);
		const task = new TaskModel({ ...req.body, tenancyId, userId });

		this.taskService
			.save(task)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	edit(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = getTenancyByToken(req) || Number(req.body.tenancyId || req.query.tenancyId);
		const task = new TaskModel({ ...req.body, tenancyId }, Number(id));

		this.taskService
			.save(task)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	list(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = getTenancyByToken(req) || Number(req.query.tenancyId);
		const options = new ReadOptionsModel({ ...req.query, tenancyId });

		this.taskService
			.read(options, Number(id))
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	remove(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = getTenancyByToken(req) || Number(req.query.tenancyId);

		this.taskService
			.disabled(Number(id), tenancyId)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	private validateRequest(req: Request) {
		const { title, end, level, status, unitId, users, themes } = req.body;
		const tenancyId = getTenancyByToken(req) || Number(req.body.tenancyId);

		const requireds = requiredFields([
			{ field: title, message: isRequired('title') },
			{ field: end, message: isRequired('end') },
			{ field: level, message: isRequired('level') },
			{ field: status, message: isRequired('status') },
			{ field: unitId, message: isRequired('unitId') },
			{ field: users, message: isRequired('users') },
			{ field: themes, message: isRequired('themes') },
			{ field: tenancyId, message: isRequired('tenancyId') },
		]);

		notExistisOrError(requireds, { message: requireds?.join('\n '), status: BAD_REQUEST });
	}
}
