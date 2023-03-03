import { Knex } from 'knex';
import { RedisClientType } from 'redis';

import { MailerConfig } from 'src/config';
import { IServiceOptions } from 'src/repositories/types';
import { AuthService, KeywordService, MailService, ThemeService, UnitService, UserService } from 'src/services';

export class ServicesFactory {
	authService: AuthService;
	userService: UserService;
	mailService: MailService;
	unitService: UnitService;
	keywordService: KeywordService;
	themeService: ThemeService;

	constructor(private conn: Knex, private client: RedisClientType, private mailConfig: MailerConfig) {
		this.userService = new UserService({ ...this.setServiceOptions() });
		this.mailService = new MailService(this.mailConfig);
		this.authService = new AuthService(this.userService, this.mailService);
		this.unitService = new UnitService({ ...this.setServiceOptions() });
		this.keywordService = new KeywordService(this.setServiceOptions());
		this.themeService = new ThemeService(this.setServiceOptions());
	}

	private setServiceOptions = (): IServiceOptions => ({ conn: this.conn, cacheClient: this.client });
}
