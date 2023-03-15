import { BAD_REQUEST } from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { PropositionsTypeService } from 'src/services';
import { existsOrError, isRequired, setFileToSave } from 'src/utils';
import { ResponseHandle } from 'src/core/handlers';
import { PropositionsTypeModel } from 'src/repositories/models';

export class PropositionsTypeController extends Controller {
	constructor(private PropositionsTypeService: PropositionsTypeService) {
		super();
	}

	async save(req: Request, res: Response) {
		try {
			this.validateRequest(req);
		} catch (err) {
			return ResponseHandle.onError({ res, err });
		}
		const document = setFileToSave(req);
		const propositionsType = new PropositionsTypeModel({ ...req.body, document });

		this.PropositionsTypeService.save(propositionsType)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	edit(req: Request, res: Response) {
		const { id } = req.params;
		const document = setFileToSave(req);
		const propositionsType = new PropositionsTypeModel({ ...req.body, document }, Number(id));

		this.PropositionsTypeService.save(propositionsType)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	list(req: Request, res: Response) {
		const { id } = req.params;

		this.PropositionsTypeService.read(Number(id))
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	remove(req: Request, res: Response) {
		const { id } = req.params;

		this.PropositionsTypeService.desabled(Number(id))
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	private validateRequest(req: Request) {
		const { name } = req.body;

		existsOrError(name, { messsage: isRequired('name'), status: BAD_REQUEST });
	}
}
