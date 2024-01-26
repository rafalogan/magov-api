import { ExtractJwt, Strategy, StrategyOptionsWithoutRequest, VerifiedCallback } from 'passport-jwt';
import passport from 'passport';

import { deleteField } from 'src/utils';
import { IAuthConfig } from 'src/repositories/types';
import { UserService } from 'src/services';
import { Payload, UserViewModel } from 'src/repositories/models';

export class AuthConfig {
	auth: IAuthConfig;

	private readonly params: StrategyOptionsWithoutRequest;
	private authSecret: string = process.env.AUTHSECRET || '';

	constructor(private userService: UserService) {
		this.params = this.setStrategyOptions();
	}

	exec(): IAuthConfig {
		const strategy = new Strategy(this.params, this.verify.bind(this));
		const session = false;

		passport.use(strategy);
		return {
			authenticate: () => passport.authenticate('jwt', { session }),
		};
	}

	verify(payload: Payload, done: VerifiedCallback) {
		const id = Number(payload.id);

		this.userService
			.getUser(id)
			.then(data => done(null, data instanceof UserViewModel ? this.setUserNoPass(data) : false))
			.catch(error => done(error, false));
	}

	private setUserNoPass(user: UserViewModel) {
		deleteField(user, 'password');
		return user;
	}

	private setStrategyOptions(): StrategyOptionsWithoutRequest {
		const secretOrKey = this.authSecret;
		const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

		return { secretOrKey, jwtFromRequest, passReqToCallback: false };
	}
}
