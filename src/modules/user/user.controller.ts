import { BAD_REQUEST } from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { setAddress, requiredFields, notExistisOrError, equalsOrError, setUserImage, deleteField } from 'src/utils';
import { UserService } from 'src/services';
import { getTenancyByToken, ResponseHandle } from 'src/core/handlers';
import { ReadOptionsModel, UserModel } from 'src/repositories/models';

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
		const image = setUserImage(req);
		const tenancyId = req.body.tenancyId ?? getTenancyByToken(req);

		const user = new UserModel({ ...req.body, tenancyId, address, image });

		this.userService
			.save(user)
			.then((data: any) => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, message: err.message, err }));
	}

	edit(req: Request, res: Response) {
		const { id } = req.params;
		const address = setAddress(req);
		const image = setUserImage(req);
		const user = new UserModel({ ...req.body, address, image }, Number(id));

		this.userService
			.save(user)
			.then((data: any) => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, message: err.message, err }));
	}

	list(req: Request, res: Response) {
		const tenancyId = req.query.tenancyId ? Number(req.query.tenancyId) : getTenancyByToken(req) || undefined;
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
			.remove(Number(id))
			.then((data: any) => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, message: err.message, err }));
	}

	private async isUserValid(req: Request) {
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

		notExistisOrError(requireds, { message: `${requireds?.join(' is required \n')} is required`, status: BAD_REQUEST });
		equalsOrError(password, confirmPassword, { message: 'confirmPassword should be equal to password', status: BAD_REQUEST });
	}
}
