import { BAD_REQUEST } from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { PlaintiffService } from 'src/services';
import { existsOrError, isRequired, notExistisOrError, requiredFields } from 'src/utils';
import { getTenancyByToken, ResponseHandle } from 'src/core/handlers';
import { PlaintiffModel, ReadOptionsModel } from 'src/repositories/models';

export class PlaintiffController extends Controller {
	constructor(private plaintiffService: PlaintiffService) {
		super();
	}

	save(req: Request, res: Response) {
		try {
			this.validateRequest(req);
		} catch (err) {
			return ResponseHandle.onError({ res, err });
		}

		const tenancyId = Number(req.body.tenancyId) || getTenancyByToken(req);
		const plaintiff = new PlaintiffModel({ ...req.body, tenancyId });

		this.plaintiffService
			.save(plaintiff)
			.then(data => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	edit(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = Number(req.body.tenancyId) || getTenancyByToken(req);
		const plaintiff = new PlaintiffModel({ ...req.body, tenancyId }, Number(id));

		this.plaintiffService
			.save(plaintiff)
			.then(data => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	list(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = Number(req.query.tenancyId) || getTenancyByToken(req);
		const options = new ReadOptionsModel({ ...req.query, tenancyId });

		this.plaintiffService
			.read(options, Number(id))
			.then(data => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	remove(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = Number(req.query.tenancyId) || getTenancyByToken(req);

		this.plaintiffService
			.disable(Number(id), tenancyId)
			.then((data: any) => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	validateRequest(req: Request) {
		const { name, birthday, institute, cpfCnpj, phone, email, instituteTypeId } = req.body;
		const { cep, street, district, city, uf } = req.body.address;
		const tenancyId = Number(req.body.tenancyId) || getTenancyByToken(req);

		const requireds = requiredFields([
			{ field: name, message: isRequired('name') },
			{ field: birthday, message: isRequired('birthday') },
			{ field: institute, message: isRequired('institute') },
			{ field: cpfCnpj, message: isRequired('cpfCnpj') },
			{ field: phone, message: isRequired('phone') },
			{ field: email, message: isRequired('email') },
			{ field: instituteTypeId, message: isRequired('instituteTypeId') },
			{ field: cep, message: isRequired('address.cep') },
			{ field: street, message: isRequired('address.street') },
			{ field: district, message: isRequired('address.district') },
			{ field: city, message: isRequired('address.city') },
			{ field: uf, message: isRequired('address.uf') },
		]);

		notExistisOrError(requireds, requireds?.join('\n') as string);
		existsOrError(tenancyId, { message: 'tenancyId not found', status: BAD_REQUEST });
	}
}
