import httpStatus from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { responseApi, responseApiError, ResponseException, setReadOptions } from 'src/utils';
import { UserService } from 'src/services';

export class UserController extends Controller {
	constructor(private userService: UserService) {
		super();
	}

	save(req: Request, res: Response) {}

	edit(req: Request, res: Response) {}

	list(req: Request, res: Response) {}

	remove(req: Request, res: Response) {}
}
