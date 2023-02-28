import httpStatus, { BAD_REQUEST } from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import {
	extractFieldName,
	responseApi,
	ResponseException,
	setAddress,
	setReadOptions,
	requiredFields,
	notExistisOrError,
	equalsOrError,
} from 'src/utils';
import { UserService } from 'src/services';
import { ResponseHandle } from 'src/core/handlers';
import { INotificationOption } from 'src/repositories/types';
import { NotificationContext } from 'src/core/handlers/notification-context.handle';

export class UserController extends Controller {
	constructor(private userService: UserService) {
		super();
	}

	save(req: Request, res: Response) {
		try {
			this.isUserValid(req);
		} catch (message: any) {
			return ResponseHandle.onError({ res, message, status: BAD_REQUEST });
		}
	}

	edit(req: Request, res: Response) {}

	list(req: Request, res: Response) {}

	remove(req: Request, res: Response) {}

	private isUserValid(req: Request) {
		const { firstName, lastName, email, office, password, confirmPassword, cpf, phone, level } = req.body;
		const { cep, street, district, city, uf } = setAddress(req);

		const requireds = requiredFields([
			{ field: firstName, message: 'firstName' },
			{ field: lastName, message: 'lastName' },
			{ field: email, message: 'email' },
			{ field: office, message: 'office' },
			{ field: password, message: 'password' },
			{ field: confirmPassword, message: 'confirmPassword' },
			{ field: cpf, message: 'cpf' },
			{ field: phone, message: 'phone' },
			{ field: level, message: 'level' },
			{ field: cep, message: 'address.cep' },
			{ field: street, message: 'address.street' },
			{ field: district, message: 'address.district' },
			{ field: city, message: 'address.city' },
			{ field: uf, message: 'address.uf' },
		]);

		notExistisOrError(requireds, `${requireds?.join(' is required \n')} is required`);
		equalsOrError(password, confirmPassword, 'confirmPassword should be equal to password');
	}
}
