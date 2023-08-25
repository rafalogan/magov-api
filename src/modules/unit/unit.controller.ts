import { BAD_REQUEST, NOT_FOUND } from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { existsOrError, isRequired, notExistisOrError, requiredFields, setAddress } from 'src/utils';
import { UnitService } from 'src/services';
import { getTenancyByToken, onLog, ResponseHandle } from 'src/core/handlers';
import { ReadOptionsModel, UnitModel } from 'src/repositories/models';
import { IReadOptions } from 'src/repositories/types';

export class UnitController extends Controller {
	constructor(private unitService: UnitService) {
		super();
	}

	save(req: Request, res: Response) {
		try {
			this.isValidRequest(req);
		} catch (message: any) {
			return ResponseHandle.onError({ res, message, status: BAD_REQUEST });
		}
		const tenancyId = Number(req.body.tenantId) || getTenancyByToken(req);
		const address = setAddress(req);
		const unit = new UnitModel({ ...req.body, address, tenancyId, plan: { id: req.body.planId } });

		this.unitService
			.save(unit, req)
			.then(data => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err, status: err.status, message: err.message }));
	}

	edit(req: Request, res: Response) {
		const { id } = req.params;
		const address = setAddress(req);
		const tenancyId = getTenancyByToken(req) || Number(req.body.tenancyId || req.query.tenancyId);

		try {
			existsOrError(tenancyId, { message: isRequired('tenancyId'), status: BAD_REQUEST });
		} catch (err) {
			return ResponseHandle.onError({ res, err });
		}

		const unit = new UnitModel({ ...req.body, address, plan: req.body.plan || { id: req.body.planId }, tenancyId }, Number(id));
		onLog('Unit to update', unit);

		this.unitService
			.save(unit, req)
			.then(data => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err, status: err.status, message: err.message }));
	}

	list(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = getTenancyByToken(req) || Number(req.query.tenancyId);

		onLog('tenancy to list', tenancyId);

		try {
			existsOrError(tenancyId, isRequired('Query param tenancyId'));
		} catch (message: any) {
			return ResponseHandle.onError({ res, message, status: BAD_REQUEST });
		}

		const options = new ReadOptionsModel({ ...req.query, tenancyId } as IReadOptions);

		this.unitService
			.read(options, Number(id))
			.then(data => {
				if (id && data.tenancyId !== tenancyId) return ResponseHandle.onError({ res, message: 'Unit Not Found.', status: NOT_FOUND });
				return ResponseHandle.onSuccess({ res, data, status: data.status });
			})
			.catch(err => ResponseHandle.onError({ res, message: err.message, status: err.status }));
	}

	remove(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = getTenancyByToken(req) || Number(req.query.tenancyId);

		try {
			existsOrError(tenancyId, { message: isRequired('tenancyId'), status: BAD_REQUEST });
		} catch (err) {
			return ResponseHandle.onError({ res, err });
		}

		this.unitService
			.desactve(Number(id), tenancyId, req)
			.then((data: any) => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err, message: err.message, status: err.status }));
	}

	private isValidRequest(req: Request) {
		const { name, cnpj, phone, planId } = req.body;
		const { cep, street, district, city, uf } = setAddress(req);
		const tenancyId = getTenancyByToken(req) || Number(req.body.tenancyId);
		const requireds = requiredFields([
			{ field: name, message: 'name' },
			{ field: cnpj, message: 'cnpj' },
			{ field: phone, message: 'phone' },
			{ field: planId, message: 'planId' },
			{ field: cep, message: 'cep' },
			{ field: street, message: 'street' },
			{ field: district, message: 'district' },
			{ field: city, message: 'city' },
			{ field: uf, message: 'uf' },
			{ field: tenancyId, message: 'tenancyId' },
		]);

		notExistisOrError(requireds, requireds?.map(f => isRequired(f)).join('\n ') as string);
	}
}
