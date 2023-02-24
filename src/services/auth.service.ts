import jwt from 'jwt-simple';
import { Request } from 'express';
import httpStatus from 'http-status';

import { decodeToken, extractToken, getPayload, onLog } from 'src/core/handlers';

import { Credentials, Payload, RecoveryModel, UserModel, UserViewModel } from 'src/repositories/models';
import { ICredentials, IUserModel, SendEmailOptions } from 'src/repositories/types';
import { existsOrError, isMatch, isRequired, requiredFields } from 'src/utils';
import { UserService } from './user.service';
import { MailService } from './mail.service';

export class AuthService {
	private authsecret = process.env.AUTHSECRET as string;

	constructor(private userService: UserService, private mailsService: MailService) {}

	validateCredentials(credentials: ICredentials) {
		try {
			existsOrError(credentials.email, 'required data not filled in, verify email or password');
			existsOrError(credentials.password, 'required data not filled in, verify email or password');
		} catch (err) {
			return err;
		}
	}

	validateSignupData(data: IUserModel) {
		const requiredEmpty = requiredFields([
			{ field: data.firstName, message: isRequired('Fist Name') },
			{ field: data.lastName, message: isRequired('last Name') },
			{ field: data.email, message: isRequired('E-mail') },
			{ field: data.password, message: isRequired('Password') },
			{ field: data.confirmPassword, message: isRequired('Confirm Password') },
			{ field: data.cpf, message: isRequired('CPF') },
			{ field: data.phone, message: isRequired('Phone') },
			{ field: data.office, message: isRequired('Office') },
			{ field: data.level, message: isRequired('Level') },
			{ field: data.tenancyId, message: '' },
			{ field: data.address.cep, message: isRequired('CEP') },
			{ field: data.address.street, message: isRequired('Street') },
			{ field: data.address.district, message: isRequired('District') },
			{ field: data.address.city, message: isRequired('City') },
			{ field: data.address.uf, message: isRequired('Uf') },
			{ field: data.planId, message: isRequired('Plan') },
		]);

		if (requiredEmpty?.length !== 0) throw requiredEmpty?.join('\n');
	}

	async verifyCredentials(credentials: Credentials) {
		const userFromDb = (await this.userService.getUser(credentials.email)) as UserViewModel;

		existsOrError(userFromDb, 'User not found');

		if (isMatch(credentials, userFromDb)) {
			const payload = new Payload(userFromDb);
			return { ...payload, token: jwt.encode(payload, this.authsecret) };
		}
	}

	async signupOnApp(user: UserModel) {
		try {
			existsOrError(user.planId, 'Plan not found!');

			onLog('User to save:', user);
			return this.userService.save(user);
		} catch (err) {
			return err;
		}
	}

	getPayload(req: Request) {
		return getPayload(req);
	}

	async tokenIsValid(req: Request) {
		const token = this.extractToken(req);
		const payload = token ? this.decodeToken(token) : undefined;
		const valid = payload?.exp ? new Date(payload.exp * 1000) > new Date() : false;
		const status = valid ? httpStatus.OK : httpStatus.UNAUTHORIZED;

		existsOrError(token, 'Token not found!');
		existsOrError(payload, 'Payload not found!');

		return valid ? { valid, status, message: 'Token valid to use.', token } : { valid, status, message: 'Invalid token!', token };
	}

	async verifyEmailUser(email: string, options: SendEmailOptions) {
		try {
			const user = (await this.userService.getUser(email)) as UserViewModel;

			if (user) return this.mailsService.send({ ...options, to: user.email });

			throw { status: httpStatus.NOT_FOUND, messsage: 'Email not found!' };
		} catch (err) {
			return err;
		}
	}

	async recoveryPassword(data: RecoveryModel) {
		try {
			const user = (await this.userService.getUser(data.email)) as UserViewModel;

			if (user) {
				const toSave = new UserModel({
					...user,
					confirmPassword: data.confirmPassword,
					password: data.password,
					userRules: user.userRules.map(r => Number(r.id)),
				} as IUserModel);

				return this.userService.update(toSave, user.id);
			}

			throw { status: httpStatus.NOT_FOUND, message: 'User not found.' };
		} catch (err) {
			return err;
		}
	}

	private extractToken = (req: Request) => extractToken(req);

	private decodeToken = (token: string): Payload => decodeToken(token);
}
