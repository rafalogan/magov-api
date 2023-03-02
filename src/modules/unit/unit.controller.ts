import { BAD_REQUEST } from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { existsOrError, isRequired, notExistisOrError, requiredFields, setAddress } from 'src/utils';
import { UnitService } from 'src/services';
import { getTenancyByToken, ResponseHandle } from 'src/core/handlers';
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
		const unit = new UnitModel({ ...req.body, address: setAddress(req), tenancyId });

		this.unitService
			.save(unit)
			.then(data => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err, status: err.status, message: err.message }));
	}

	edit(req: Request, res: Response) {
		const { id } = req.params;
		const address = setAddress(req);
		const unit = new UnitModel({ ...req.body, address }, Number(id));

		this.unitService
			.save(unit)
			.then(data => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err, status: err.status, message: err.message }));
	}

	list(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = req.query.tenancyId || getTenancyByToken(req);

		try {
			existsOrError(tenancyId, isRequired('Query param tenancyId'));
		} catch (message: any) {
			return ResponseHandle.onError({ res, message, status: BAD_REQUEST });
		}

		const options = new ReadOptionsModel({ ...req.query, tenancyId } as IReadOptions);

		this.unitService
			.read(options, Number(id))
			.then(data => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, message: err.message, status: err.status }));
	}

	remove(req: Request, res: Response) {
		const { id } = req.params;

		this.unitService
			.desactve(Number(id))
			.then((data: any) => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err, message: err.message, status: err.status }));
	}

	private isValidRequest(req: Request) {
		const { name, cnpj, phone } = req.body;
		const { cep, street, district, city, uf } = setAddress(req.body);
		const requireds = requiredFields([
			{ field: name, message: 'name' },
			{ field: cnpj, message: 'cnpj' },
			{ field: phone, message: 'phone' },
			{ field: cep, message: 'cep' },
			{ field: street, message: 'street' },
			{ field: district, message: 'district' },
			{ field: city, message: 'city' },
			{ field: uf, message: 'uf' },
		]);

		notExistisOrError(requireds, requireds?.map(f => isRequired(f)).join('\n ') as string);
	}
}
