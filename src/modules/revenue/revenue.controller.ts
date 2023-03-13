import { BAD_REQUEST } from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { RevenueService } from 'src/services';
import { existsOrError, isRequired, notExistisOrError, requiredFields, setFileToSave } from 'src/utils';
import { getTenancyByToken, onLog, ResponseHandle } from 'src/core/handlers';
import { ReadOptionsModel, RevenueModel } from 'src/repositories/models';

export class RevenueController extends Controller {
	constructor(private revenueService: RevenueService) {
		super();
	}

	save(req: Request, res: Response) {
		try {
			this.validateRequest(req);
		} catch (err) {
			return ResponseHandle.onError({ res, err });
		}

		const tenancyId = Number(req.body.tenancyId || req.query.tenancyId) || getTenancyByToken(req);
		const document = setFileToSave(req);
		const revenue = new RevenueModel({ ...req.body, tenancyId, document, active: true });

		this.revenueService
			.save(revenue)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	edit(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = Number(req.query.tenancyId) || getTenancyByToken(req);
		const document = setFileToSave(req);

		const revenue = new RevenueModel({ ...req.body, tenancyId, document }, Number(id));
		onLog('update revenue', revenue);
		this.revenueService
			.save(revenue)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	list(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = Number(req.query.tenancyId) || getTenancyByToken(req);
		const options = new ReadOptionsModel({ ...req.query, tenancyId });

		this.revenueService
			.read(options, Number(id))
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	remove(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = Number(req.query.tenancyId) || getTenancyByToken(req);

		this.revenueService
			.disabled(Number(id), tenancyId)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	private validateRequest(req: Request) {
		const { revenue, receive, status, value, unitId, origin, tenancyId: tId } = req.body;
		const tenacyId = Number(tId || req.query.tenancyId) || getTenancyByToken(req);

		const requireds = requiredFields([
			{ field: revenue, message: isRequired('revenue') },
			{ field: receive, message: isRequired('receive') },
			{ field: status, message: isRequired('status') },
			{ field: value, message: isRequired('value') },
			{ field: unitId, message: isRequired('unitId') },
			{ field: origin, message: isRequired('origin') },
			{ field: tenacyId, message: isRequired('tenacyId') },
		]);

		notExistisOrError(requireds, { message: requireds?.join('\n '), status: BAD_REQUEST });
	}
}
