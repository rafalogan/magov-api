import { BAD_REQUEST } from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { DemandService } from 'src/services';
import { isRequired, notExistisOrError, requiredFields } from 'src/utils';
import { getTenancyByToken, ResponseHandle } from 'src/core/handlers';
import { DemandModel, ReadOptionsModel } from 'src/repositories/models';

export class DemandController extends Controller {
	constructor(private demandService: DemandService) {
		super();
	}

	save(req: Request, res: Response) {
		try {
			this.validateRequest(req);
		} catch (err) {
			return ResponseHandle.onError({ res, err });
		}

		const tenancyId = getTenancyByToken(req);
		const demand = new DemandModel({ ...req.body, tenancyId });

		this.demandService
			.save(demand)
			.then(data => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	edit(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = getTenancyByToken(req) || Number(req.query.tenancyId);
		const demand = new DemandModel(req.body, Number(id));

		this.demandService
			.updateDemand(demand, Number(id), tenancyId)
			.then((data: any) => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	list(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = Number(req.query.tenancyId) || getTenancyByToken(req);
		const options = new ReadOptionsModel({ ...req.query, tenancyId });

		this.demandService
			.read(options as ReadOptionsModel, Number(id))
			.then((data: any) => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch((err: any) => ResponseHandle.onError({ res, err }));
	}

	remove(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = Number(req.query.tenancyId) || getTenancyByToken(req);

		this.demandService
			.disabled(Number(id), tenancyId)
			.then((data: any) => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch((err: any) => ResponseHandle.onError({ res, err }));
	}

	favorite(req: Request, res: Response) {
		const { id } = req.params;

		this.demandService
			.favorite(Number(id))
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	private validateRequest(req: Request) {
		const { name, keywords, themes, description, deadLine, userId, unitId } = req.body;
		const { name: plaintiff, birthday, institute, instituteTypeId, cpfCnpj } = req.body.plaintiff;
		const { cep, uf, street, district, city } = req.body.plaintiff.address;

		const requireds = requiredFields([
			{ field: name, message: isRequired('name') },
			{ field: keywords, message: isRequired('keywords') },
			{ field: themes, message: isRequired('themes') },
			{ field: description, message: isRequired('description') },
			{ field: deadLine, message: isRequired('deadLine') },
			{ field: userId, message: isRequired('userId') },
			{ field: unitId, message: isRequired('unitId') },
			{ field: plaintiff, message: isRequired('plaintiff.name') },
			{ field: birthday, message: isRequired('plaintiff.birthday') },
			{ field: institute, message: isRequired('plaintiff.isntitute') },
			{ field: instituteTypeId, message: isRequired('plaintiff.isntituteTypeId') },
			{ field: cpfCnpj, message: isRequired('plaintiff.cpfCnpj') },
			{ field: cep, message: isRequired('address.cep') },
			{ field: uf, message: isRequired('address.uf') },
			{ field: street, message: isRequired('address.street') },
			{ field: district, message: isRequired('address.district') },
			{ field: city, message: isRequired('address.city') },
		]);

		notExistisOrError(requireds, { message: requireds?.join('\n') as string, status: BAD_REQUEST });
	}
}
