import { Request, Response } from 'express';
import { BAD_REQUEST } from 'http-status';

import { Controller } from 'src/core/controllers';
import { getTenancyByToken, ResponseHandle } from 'src/core/handlers';
import { PropositionModel, PropositionsReadOptionsModel } from 'src/repositories/models';
import { ITaskProposition } from 'src/repositories/types';
import { PropositionService } from 'src/services';
import { isRequired, notExistisOrError, requiredFields } from 'src/utils';

export class PropositionController extends Controller {
	constructor(private propositionService: PropositionService) {
		super();
	}

	async save(req: Request, res: Response) {
		try {
			this.validateRequest(req);
		} catch (err) {
			return ResponseHandle.onError({ res, err });
		}

		const tenancyId = Number(req.body) || getTenancyByToken(req);
		const proposition = new PropositionModel({ ...req.body, tenancyId });

		this.propositionService
			.save(proposition)
			.then(data => ResponseHandle.onSuccess({ res, data, status: data?.status }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	edit(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = getTenancyByToken(req) || Number(req.body || req.query.tenancyId);
		const proposition = new PropositionModel({ ...req.body, tenancyId }, Number(id));

		this.propositionService
			.save(proposition)
			.then(data => ResponseHandle.onSuccess({ res, data, status: data?.status }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	list(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = getTenancyByToken(req) || Number(req.query.tenancyId);
		const options = new PropositionsReadOptionsModel({ ...req.query, tenancyId });

		this.propositionService
			.read(options, Number(id))
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	remove(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = getTenancyByToken(req) || Number(req.query.tenancyId);

		this.propositionService
			.disabled(Number(id), tenancyId)
			.then((data: any) => ResponseHandle.onSuccess({ res, data, status: data?.status }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	favorite(req: Request, res: Response) {
		const { id } = req.params;

		this.propositionService
			.favorite(Number(id))
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	private validateRequest(req: Request) {
		const { title, menu, deadline, unitId, typeId, themes, keywords, tasks } = req.body;
		const tenancyId = getTenancyByToken(req) || Number(req.body.tenancyId);

		const requireds = requiredFields([
			{ field: title, message: isRequired('title') },
			{ field: menu, message: isRequired('menu') },
			{ field: deadline, message: isRequired('deadline') },
			{ field: unitId, message: isRequired('unitId') },
			{ field: typeId, message: isRequired('typeId') },
			{ field: themes, message: isRequired('themes') },
			{ field: keywords, message: isRequired('keywords') },
			{ field: tasks, message: isRequired('tasks') },
			{ field: tenancyId, message: isRequired('tenancyId') },
		]);

		notExistisOrError(requireds, { message: requireds?.join('\n '), status: BAD_REQUEST });
		if (tasks?.lengh) this.validateTasks(tasks);
	}

	private validateTasks(tasks: ITaskProposition[]) {
		return tasks.map((i, ind) => {
			const { userId, task, deadline } = i;
			const requireds = requiredFields([
				{ field: userId, message: isRequired('userId') },
				{ field: task, message: isRequired('task') },
				{ field: deadline, message: isRequired('deadline') },
			]);

			notExistisOrError(requireds, { message: `task: ${ind + 1} fields: ${requireds?.join('\n ')}`, status: BAD_REQUEST });
		});
	}
}
