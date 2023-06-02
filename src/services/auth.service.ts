import jwt from 'jwt-simple';
import { Request } from 'express';
import httpStatus, { UNAUTHORIZED } from 'http-status';

import { decodeToken, extractToken, getPayload, onLog } from 'src/core/handlers';

import { Credentials, Payload, RecoveryModel, UserModel, UserViewModel } from 'src/repositories/models';
import { ICredentials, IUserModel, SendEmailOptions } from 'src/repositories/types';
import { existsOrError, isMatch, isRequired, notExistisOrError, requiredFields } from 'src/utils';
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
			{ field: data.firstName, message: isRequired('firstName') },
			{ field: data.lastName, message: isRequired('lastName') },
			{ field: data.email, message: isRequired('email') },
			{ field: data.password, message: isRequired('password') },
			{ field: data.confirmPassword, message: isRequired('confirmPassword') },
			{ field: data.cpf, message: isRequired('cpf') },
			{ field: data.phone, message: isRequired('phone') },
			{ field: data.office, message: isRequired('office') },
			{ field: data.level, message: isRequired('level') },
			{ field: data.address.cep, message: isRequired('address.cep') },
			{ field: data.address.street, message: isRequired('address.street') },
			{ field: data.address.district, message: isRequired('address.district') },
			{ field: data.address.city, message: isRequired('address.city') },
			{ field: data.address.uf, message: isRequired('address.uf') },
		]);

		notExistisOrError(requiredEmpty, requiredEmpty?.join('\n') as string);
	}

	async verifyCredentials(credentials: Credentials) {
		const userFromDb = (await this.userService.getUser(credentials.email)) as UserViewModel;
		onLog('user verification db', userFromDb);

		existsOrError(userFromDb, 'User not found');
		existsOrError(userFromDb.active, 'User desactivated');
		onLog('user from DB', userFromDb);

		if (isMatch(credentials, userFromDb)) {
			const payload = new Payload(userFromDb);
			onLog('payload', payload);
			return { ...payload, token: jwt.encode(payload, this.authsecret) };
		}

		return { status: UNAUTHORIZED, message: 'Login unauthorized! verify your credentials.' };
	}

	async signupOnApp(user: UserModel) {
		try {
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
			onLog('user', user);

			if (user?.email) {
				await this.mailsService.send({ ...options, to: user.email });

				return { status: httpStatus.OK, message: 'E-mail send to user with success' };
			}

			throw { status: httpStatus.NOT_FOUND, messsage: 'Email not found!' };
		} catch (err) {
			return err;
		}
	}

	async recoveryPassword(data: RecoveryModel) {
		try {
			const user = (await this.userService.getUser(data.email)) as UserViewModel;

			if (user?.email) {
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
