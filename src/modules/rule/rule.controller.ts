import { BAD_REQUEST, FORBIDDEN, UNAUTHORIZED } from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { RuleService } from 'src/services';
import { existsOrError, isRequired, notExistisOrError } from 'src/utils';
import { getTenancyByToken, ResponseHandle } from 'src/core/handlers';
import { Rule } from 'src/repositories/entities';

export class RuleController extends Controller {
	constructor(private ruleService: RuleService) {
		super();
	}

	async save(req: Request, res: Response) {
		try {
			this.verifyRequest(req);
		} catch (err) {
			return ResponseHandle.onError({ res, err });
		}

		if (getTenancyByToken(req)) {
			return ResponseHandle.onError({ res, message: 'This user is not authorized for this action', status: UNAUTHORIZED });
		}

		const rule = new Rule(req.body);

		this.ruleService
			.save(rule)
			.then(data => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	edit(req: Request, res: Response) {
		const { id } = req.params;
		const rule = new Rule(req.body, Number(id));

		this.ruleService
			.save(rule)
			.then(data => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	list(req: Request, res: Response) {
		const { id } = req.params;
		this.ruleService
			.read(Number(id))
			.then(data => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	remove(req: Request, res: Response) {
		const { id } = req.body;

		this.ruleService
			.delete(id)
			.then((data: any) => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	async verifyRequest(req: Request) {
		const { name } = req.body;
		const fromDB = await this.ruleService.getRule(name);

		notExistisOrError(fromDB, { message: 'Rules already exist.', status: FORBIDDEN });
		existsOrError(name, { message: isRequired('name'), status: BAD_REQUEST });
	}
}
