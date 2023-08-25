import { BAD_REQUEST } from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { GovernmentRevenueService } from 'src/services';
import { getTenancyByToken, ResponseHandle } from 'src/core/handlers';
import { existsOrError, isRequired, notExistisOrError, requiredFields } from 'src/utils';
import { GovernmentRevenueModel, ReadOptionsModel } from 'src/repositories/models';

export class GovernmentRevenueController extends Controller {
	constructor(private governmentRevenueService: GovernmentRevenueService) {
		super();
	}

	save(req: Request, res: Response) {
		try {
			this.verifyRequest(req);
		} catch (err) {
			return ResponseHandle.onError({ res, err });
		}

		const origin = req.body.typeOfRecipe ?? req.body.origin;

		const tenancyId = getTenancyByToken(req) || Number(req.body.tenancyId);
		const revenue = new GovernmentRevenueModel({ ...req.body, tenancyId, origin });

		this.governmentRevenueService
			.save(revenue, req)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	edit(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = getTenancyByToken(req) || Number(req.body.tenancyId);
		const origin = req.body.typeOfRecipe ?? req.body.origin;
		const revenue = new GovernmentRevenueModel({ ...req.body, tenancyId, origin }, Number(id));

		this.governmentRevenueService
			.save(revenue, req)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	list(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = getTenancyByToken(req) || Number(req.query.tenancyId);
		const options = new ReadOptionsModel({ ...req.query, tenancyId });

		this.governmentRevenueService
			.read(options, Number(id))
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	remove(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = getTenancyByToken(req) || Number(req.query.tenancyId);

		try {
			existsOrError(tenancyId, { message: isRequired('tenancyId'), status: BAD_REQUEST });
		} catch (err) {
			return ResponseHandle.onError({ res, err });
		}

		this.governmentRevenueService
			.disebled(Number(id), tenancyId, req)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	private verifyRequest(req: Request) {
		const { origin, typeOfRecipe, unitId, revenue, receive, documentNumber, value } = req.body;
		const tenancyId = getTenancyByToken(req) || Number(req.body.tenancyId);

		const requireds = requiredFields([
			{ field: origin || typeOfRecipe, message: isRequired('typeOfRecipe or origin') },
			{ field: unitId, message: isRequired('unitId') },
			{ field: revenue, message: isRequired('revenue') },
			{ field: receive, message: isRequired('receive') },
			{ field: documentNumber, message: isRequired('documentNumber') },
			{ field: value, message: isRequired('value') },
			{ field: tenancyId, message: isRequired('tenancyId') },
		]);

		notExistisOrError(requireds, { message: requireds?.join('\n '), status: BAD_REQUEST });
	}
}
