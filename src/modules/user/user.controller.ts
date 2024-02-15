import { BAD_REQUEST } from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { deleteField, equalsOrError, notExistisOrError, requiredFields, setAddress, setUserImage } from 'src/utils';
import { UserService } from 'src/services';
import { getTenancyByToken, onLog, ResponseHandle } from 'src/core/handlers';
import { ReadOptionsModel, UserModel } from 'src/repositories/models';
import { IUserModel } from 'src/repositories/types';

export class UserController extends Controller {
	constructor(private userService: UserService) {
		super();
	}

	async save(req: Request, res: Response) {
		try {
			await this.isUserValid(req);
		} catch (err: any) {
			return ResponseHandle.onError({ res, err });
		}

		const address = setAddress(req);
		onLog('Address user', address);
		const image = setUserImage(req);
		const tenancyId = getTenancyByToken(req) || req.body.tenancyId;
		const userRules = this.setUserRules(req);

		const user = new UserModel({ ...req.body, tenancyId, address, image, userRules });
		onLog('User to save', user);

		this.userService
			.save(user, req)
			.then((data: any) => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, message: err.message, err }));
	}

	edit(req: Request, res: Response) {
		const { id } = req.params;
		const { firstName, lastName, email, cpf, phone, office, active, level, tenancyId, unitId, unit, plans } = req.body;

		const address = setAddress(req);

		onLog('Address user to edit', address);

		const image = setUserImage(req);
		const userRules = this.setUserRules(req);

		const data: IUserModel = {
			firstName,
			lastName,
			email,
			password: '',
			cpf,
			phone,
			office,
			active,
			level,
			tenancyId,
			unitId: unitId ? Number(unitId) : unit?.id ? Number(unit.id) : undefined,
			address,
			image,
			userRules,
			plans,
		};
		const user = new UserModel(data, Number(id));

		this.userService
			.save(user, req)
			.then((data: any) => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, message: err.message, err }));
	}

	list(req: Request, res: Response) {
		const tenancyId = getTenancyByToken(req) || Number(req.query.tenancyId);
		const options = new ReadOptionsModel({ ...req.query, tenancyId });
		const { id } = req.params;

		this.userService
			.read(options, Number(id))
			.then((data: any) => {
				if ('password' in data) deleteField(data, 'password');
				return ResponseHandle.onSuccess({ res, data, status: data.status });
			})
			.catch(err => ResponseHandle.onError({ res, message: err.message, err }));
	}

	remove(req: Request, res: Response) {
		const { id } = req.params;

		this.userService
			.remove(Number(id), req)
			.then((data: any) => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, message: err.message, err }));
	}

	private setUserRules(req: Request) {
		const { userRules } = req.body;

		onLog('userRules', userRules);
		onLog('type of userRules', typeof userRules);

		if (!userRules) return [];
		if (Array.isArray(userRules)) return userRules;

		return JSON.parse(userRules);
	}

	private async isUserValid(req: Request) {
		onLog('body', req.body);
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

		notExistisOrError(requireds, { message: `${requireds?.join(' is required \n ')} is required`, status: BAD_REQUEST });
		equalsOrError(password, confirmPassword, {
			message: 'confirmPassword should be equal to password',
			status: BAD_REQUEST,
		});
	}
}
