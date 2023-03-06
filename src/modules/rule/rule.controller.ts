import { BAD_REQUEST, FORBIDDEN, UNAUTHORIZED } from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { RuleService } from 'src/services';
import { existsOrError, isRequired, notExistisOrError } from 'src/utils';
import { getTenancyByToken, onLog, ResponseHandle } from 'src/core/handlers';
import { Rule } from 'src/repositories/entities';

export class RuleController extends Controller {
	constructor(private ruleService: RuleService) {
		super();
	}

	async save(req: Request, res: Response) {
		try {
			await this.verifyRequest(req);
		} catch (err) {
			return ResponseHandle.onError({ res, err });
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
		const { id } = req.params;

		this.ruleService
			.delete(Number(id))
			.then((data: any) => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	async verifyRequest(req: Request) {
		try {
			const { name } = req.body;
			const tenantId = getTenancyByToken(req);

			notExistisOrError(tenantId, { message: 'This user is not authorized for this action', status: UNAUTHORIZED });
			existsOrError(name, { message: isRequired('name'), status: BAD_REQUEST });
		} catch (err: any) {
			return err;
		}
	}
}
