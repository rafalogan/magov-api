import { Application } from 'express';

import { AuthConfig } from 'src/config';
import { IAuthConfig } from 'src/repositories/types';

export abstract class Routes {
	protected app: Application;
	protected auth?: AuthConfig;

	protected constructor(app: Application, auth?: AuthConfig) {
		this.app = app;
		this.auth = auth;
	}

	abstract exec(): void;
}
