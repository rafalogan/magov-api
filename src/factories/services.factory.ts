import { Knex } from 'knex';
import { RedisClientType } from 'redis';

import { MailerConfig } from 'src/config';

export class ServicesFactory {
	constructor(private conn: Knex, private client: RedisClientType, private mailConfig: MailerConfig) {}
}
