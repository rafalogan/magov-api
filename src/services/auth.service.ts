import jwt from 'jwt-simple';

import { Credentials, Payload, UserViewModel } from 'src/repositories/models';
import { ICredentials } from 'src/repositories/types';
import { existsOrError, isMatch } from 'src/utils';
import { UserService } from './user.service';

export class AuthService {
	private authSicret = process.env.AUTHSECRET;

	constructor(private userService: UserService) {}

	validateCredentials(credentials: ICredentials) {
		try {
			existsOrError(credentials.email, 'required data not filled in, verify email or password');
			existsOrError(credentials.password, 'required data not filled in, verify email or password');
		} catch (err) {
			return err;
		}
	}

	setCredentials(credentials: ICredentials) {
		return new Credentials(credentials);
	}

	async verifyCredentials(credentials: Credentials) {
		const userFromDb = (await this.userService.getUser(credentials.email)) as UserViewModel;

		existsOrError(userFromDb, 'User not found');

		if (isMatch(credentials, userFromDb)) {
			const payload = new Payload(userFromDb);
			return { ...payload, token: jwt.encode(payload, this.authsecret) };
		}
	}

	async signupOnApp(user: IUser, profile?: string) {
		try {
			const profileToId = await this.profileService.findProfileByName(profile?.toLowerCase() || 'cliente');

			onLog('perfil', profileToId);
			existsOrError(profileToId, messages.profile.error.notFound(profile?.toLowerCase() || 'cliente'));
			await this.userService.validateNewUser(user);

			user.profileId = profileToId.id;
		} catch (err) {
			return err;
		}

		const userToSave = this.userService.set(user);
		onLog('User to save:', user);

		return this.userService
			.save(userToSave)
			.then(result => result)
			.catch(err => err);
	}

	getPayload(req: Request) {
		return getPayload(req);
	}

	async tokenIsValid(req: Request): Promise<ValidateTokenResponse> {
		const token = this.extractToken(req);
		const payload = token ? this.decodeToken(token) : undefined;
		const valid = payload?.exp ? new Date(payload.exp * 1000) > new Date() : false;
		const status = valid ? httpStatus.OK : httpStatus.UNAUTHORIZED;

		existsOrError(token, messages.auth.error.notFoundToken);
		existsOrError(payload, messages.auth.error.notFoundPayload);

		return valid
			? { valid, status, message: messages.auth.success.tokenIsValid, token }
			: { valid, status, message: messages.auth.error.tokenNoValid, token };
	}

	private extractToken(req: Request) {
		return extractToken(req);
	}

	private decodeToken(token: string): Payload {
		return decodeToken(token);
	}
}
