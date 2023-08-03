import { createClient, RedisClientType } from 'redis';

import { onError, onInfo } from 'src/core/handlers';

export class CacheConfig {
	private readonly _connection: RedisClientType;
	private _enabledCache = process.env.ENABLE_CACHE === 'true';
	connectonUp = false;

	constructor() {
		const url = `redis://${process.env.REDIS_HOST}:${Number(process.env.REDIS_PORT)}`;

		this._connection = createClient({ url });
	}

	get connection() {
		return this._connection;
	}

	get enabledCache() {
		return this._enabledCache;
	}

	isConnect() {
		if (!this.enabledCache) return onInfo('Cache is disabled');

		return this.connection
			.connect()
			.then(() => this.onConnect())
			.catch(() => this.onCacheError())
			.finally(() => this.onReady());
	}

	disconnect() {
		if (this.connection) return this.connection.quit();
	}

	private onConnect() {
		return onInfo('SUCCESS: Cache(Redis) is connected');
	}

	private onReady() {
		this.connectonUp = true;
		return onInfo('ONLINE: Cache Redis...');
	}

	private onCacheError(error?: any) {
		return onError('FAILED: Cache Redis is not connected', error);
	}
}
