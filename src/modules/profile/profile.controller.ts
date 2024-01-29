import { BAD_REQUEST } from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { existsOrError, isRequired } from 'src/utils';
import { ProfileService } from 'src/services';
import { ResponseHandle } from 'src/core/handlers';
import { ProfileModel } from 'src/repositories/models';

export class ProfileController extends Controller {
	constructor(private profileService: ProfileService) {
		super();
	}

	save(req: Request, res: Response) {
		try {
			this.verify(req);
		} catch (err: any) {
			return ResponseHandle.onError({ res, err });
		}

		const profile = new ProfileModel(req.body);

		this.profileService
			.save(profile, req)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	edit(req: Request, res: Response) {
		const { filter } = req.params;
		const profile = new ProfileModel(req.body);

		this.profileService
			.update(profile, filter, req)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	list(req: Request, res: Response) {
		const { filter } = req.params;

		this.profileService
			.read(filter)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	disable(req: Request, res: Response) {
		const { filter } = req.params;

		this.profileService
			.desactivate(filter, req)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.then(err => ResponseHandle.onError({ res, err }));
	}

	remove(req: Request, res: Response) {
		const { filter } = req.params;

		this.profileService
			.delete(filter, req)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	verify(req: Request) {
		const { name, code, rules } = req.body;

		existsOrError(name, { message: isRequired('name'), status: BAD_REQUEST });
		existsOrError(code, { message: isRequired('code'), status: BAD_REQUEST });
		existsOrError(rules.length, { message: isRequired('rules'), status: BAD_REQUEST });
	}
}
