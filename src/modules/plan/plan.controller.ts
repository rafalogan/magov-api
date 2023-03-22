import { BAD_REQUEST, UNAUTHORIZED } from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { PlanService } from 'src/services';
import { isRequired, notExistisOrError, requiredFields } from 'src/utils';
import { getTenancyByToken, ResponseHandle } from 'src/core/handlers';
import { Plan } from 'src/repositories/entities';
import { ReadOptionsModel } from 'src/repositories/models';

export class PlanController extends Controller {
	constructor(private planService: PlanService) {
		super();
	}

	save(req: Request, res: Response) {
		if (getTenancyByToken(req)) return ResponseHandle.onError({ message: 'User Unauthorized', status: UNAUTHORIZED, res });
		try {
			this.validRequest(req);
		} catch (message: any) {
			return ResponseHandle.onError({ res, message, status: BAD_REQUEST });
		}

		const plan = new Plan(req.body);

		this.planService
			.save(plan)
			.then(data => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	edit(req: Request, res: Response) {
		if (getTenancyByToken(req)) return ResponseHandle.onError({ message: 'User Unauthorized', status: UNAUTHORIZED, res });

		const { id } = req.params;
		const plan = new Plan(req.body, Number(id));

		this.planService
			.save(plan)
			.then(data => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	list(req: Request, res: Response) {
		const { id } = req.params;
		const options = new ReadOptionsModel(req.query);

		this.planService
			.read(options, Number(id))
			.then((data: any) => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	remove(req: Request, res: Response) {
		if (getTenancyByToken(req)) return ResponseHandle.onError({ message: 'User Unauthorized', status: UNAUTHORIZED, res });
		const { id } = req.params;

		this.planService
			.delete(Number(id))
			.then((data: any) => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	private validRequest(req: Request) {
		const { name, usersLimit, unitaryValue } = req.body;

		const requireds = requiredFields([
			{ field: name, message: 'name' },
			{ field: usersLimit, message: 'usersLimit' },
			{ field: unitaryValue, message: 'unitaryValue' },
		]);

		notExistisOrError(requireds, requireds?.map(i => isRequired(i)).join('\n ') as string);
	}
}
