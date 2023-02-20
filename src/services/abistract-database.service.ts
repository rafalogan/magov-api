import { Knex } from 'knex';
import { RedisClientType } from 'redis';

import { CacheService } from './abistract-cache.service';

export abstract class Database extends CacheService {
	protected db: Knex;

	constructor(conn: Knex, cacheClient: RedisClientType) {
		super(cacheClient);

		this.db = conn;
	}
}
