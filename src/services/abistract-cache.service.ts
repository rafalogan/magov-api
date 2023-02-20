import isEmpty from 'is-empty';
import md5 from 'md5';
import { stringify } from 'querystring';
import { RedisClientType } from 'redis';

import { onError, onInfo, onLog, onWarn } from 'src/core/handlers';
import { convertToJson, existsOrError } from 'src/utils';

export abstract class CacheService {
	private readonly client: RedisClientType;

	cacheEnabled = process.env.ENABLE_CACHE === 'true';
	cacheTime = Number(process.env.CACHE_TIME) || 0;

	constructor(client: RedisClientType) {
		this.client = client;
	}

	async findByCache(args: string[], fn: () => Promise<any>, time?: number) {
		if (!this.cacheEnabled) return fn();

		try {
			const key = this.generateKey(args);

			onLog(`Search cache: ${key}, waiting...`);
			const data = await this.client.get(key as string);

			return !data || isEmpty(data) ? this.createCache(key as string, fn, time) : convertToJson(data);
		} catch (err) {
			onError('Error on find Cahe', err);
		}
	}

	async clearCache(args: string[]) {
		if (!this.cacheEnabled) return onInfo('Cache is disabled.');

		const key = this.generateKey(args);
		const data = await this.client.get(key as string);

		try {
			existsOrError(data, `Cache: ${key} is not exists.`);
		} catch (msg) {
			return onWarn(msg);
		}

		return this.client
			.del(key as string)
			.then(() => onInfo(`Cache key ${key} is deleted with success.`))
			.catch(err => onError(`Delete cache ${key} failed`, 'error', err));
	}

	private async createCache(key: string, fn: () => Promise<any>, time?: number) {
		const data = await fn();

		if (data) await this.setCache(key, data, time);
		return data;
	}

	private async setCache(key: string, data: any, time?: number) {
		const defaultTime = (time ?? this.cacheTime) * 60;
		const dataToString = stringify(data);

		return this.client
			.set(key, dataToString, { EX: defaultTime })
			.then(() => onLog(`Cache ${key}, created with success!`, 'info'))
			.catch(err => onError(`Create cache failed`, __filename, err));
	}

	private generateKey(ags: string[]) {
		try {
			existsOrError(ags, 'To generate the data key, the arguments must be filled in correctly');
			return md5(ags.join('-'));
		} catch (msg) {
			return onError(msg);
		}
	}
}
