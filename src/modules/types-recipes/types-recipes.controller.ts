import { BAD_REQUEST, FORBIDDEN } from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { TypesRecipesService } from 'src/services';
import { existsOrError, isRequired, notExistisOrError } from 'src/utils';
import { ResponseHandle, getTenancyByToken } from 'src/core/handlers';
import { TypesRecipes } from 'src/repositories/entities';

export class TypesRecipesController extends Controller {
	constructor(private typesRecipesService: TypesRecipesService) {
		super();
	}

	save(req: Request, res: Response) {
		try {
			this.verifyDataToSave(req);
		} catch (err) {
			return ResponseHandle.onError({ res, err });
		}

		this.typesRecipesService
			.save(new TypesRecipes({ ...req.body }))
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	edit(req: Request, res: Response) {
		const { id } = req.params;
		const toUpdate = new TypesRecipes({ ...req.body }, Number(id));

		this.typesRecipesService
			.save(toUpdate)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	list(req: Request, res: Response) {
		const { id } = req.params;

		this.typesRecipesService
			.read(Number(id))
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	remove(req: Request, res: Response) {
		const { id } = req.params;
		try {
			notExistisOrError(getTenancyByToken(req), { message: 'access denied', status: FORBIDDEN });
		} catch (err) {
			return ResponseHandle.onError({ res, err });
		}

		this.typesRecipesService
			.delete(Number(id))
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	private verifyDataToSave(req: Request) {
		const { origin } = req.body;

		existsOrError(origin, { message: isRequired('origin'), status: BAD_REQUEST });
		notExistisOrError(getTenancyByToken(req), { message: 'access denied', status: FORBIDDEN });
	}
}
