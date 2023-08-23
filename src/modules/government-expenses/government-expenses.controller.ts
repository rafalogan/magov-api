import { BAD_REQUEST } from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { GovernmentExpensesService } from 'src/services';
import { isRequired, notExistisOrError, requiredFields } from 'src/utils';
import { getTenancyByToken, onLog, ResponseHandle } from 'src/core/handlers';
import { GovernmentExpensesModel, ReadOptionsModel } from 'src/repositories/models';
import { GovernmentReserve } from 'src/repositories/entities';

export class GovernmentExpensesController extends Controller {
	constructor(private governmentExpensesService: GovernmentExpensesService) {
		super();
	}

	save(req: Request, res: Response) {
		try {
			this.verifyRequest(req);
		} catch (err) {
			return ResponseHandle.onError({ res, err });
		}

		const tenancyId = getTenancyByToken(req) || Number(req.body.tenancyId);
		const toSave = new GovernmentExpensesModel({ ...req.body, tenancyId });

		this.governmentExpensesService
			.save(toSave, req)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	edit(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = getTenancyByToken(req) || Number(req.body.tenancyId);
		const toUpdate = new GovernmentExpensesModel({ ...req.body, tenancyId }, Number(id));

		this.governmentExpensesService
			.save(toUpdate, req)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	list(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = getTenancyByToken(req) || Number(req.query.tenancyId);
		const options = new ReadOptionsModel({ ...req.query, tenancyId });

		this.governmentExpensesService
			.read(options, Number(id))
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	remove(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = getTenancyByToken(req) || Number(req.query.tenancyId);

		this.governmentExpensesService
			.disabled(Number(id), tenancyId, req)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	reserve(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = getTenancyByToken(req) || Number(req.query.tenancyId);

		onLog('receiver', req.body);
		const toSave = new GovernmentReserve({ ...req.body }, Number(id));

		onLog('to reserves', toSave);

		return this.governmentExpensesService
			.setReserve(toSave, tenancyId, req)
			.then(data =>
				ResponseHandle.onSuccess({
					res,
					data,
				})
			)
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	private verifyRequest(req: Request) {
		const { expense, dueDate, value, tenancyId: tId } = req.body;
		const tenancyId = getTenancyByToken(req) || Number(tId);

		const requireds = requiredFields([
			{ field: expense, message: isRequired('expense') },
			{ field: dueDate, message: isRequired('dueDate') },
			{ field: value, message: isRequired('value') },
			{ field: tenancyId, message: isRequired('tenancyId') },
		]);

		notExistisOrError(requireds, { message: requireds?.join('\n '), status: BAD_REQUEST });
	}
}
