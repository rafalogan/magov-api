import { Knex } from 'knex';
import { RedisClientType } from 'redis';

import { MailerConfig } from 'src/config';
import { IServiceOptions } from 'src/repositories/types';
import { AuthService, MailService, UserService } from 'src/services';

export class ServicesFactory {
	authService: AuthService;
	userService: UserService;
	mailService: MailService;

	constructor(private conn: Knex, private client: RedisClientType, private mailConfig: MailerConfig) {
		this.userService = new UserService({ ...this.setServiceOptions() });
		this.mailService = new MailService(this.mailConfig);
		this.authService = new AuthService(this.userService, this.mailService);
	}

	private setServiceOptions = (): IServiceOptions => ({ conn: this.conn, cacheClient: this.client });
}
