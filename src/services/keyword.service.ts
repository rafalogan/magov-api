import { BAD_REQUEST } from 'http-status';
import { Knex } from 'knex';

import { Keyword } from 'src/repositories/entities';
import { IServiceOptions } from 'src/repositories/types';
import { convertDataValues } from 'src/utils';
import { CacheService } from './abistract-cache.service';

export class KeywordService extends CacheService {
	private db: Knex;
	private table: string;

	constructor(options: IServiceOptions) {
		super(options.cacheClient);

		this.db = options.conn;
		this.table = 'keywords';
	}

	async read(id?: number) {
		if (id) {
			return this.db(this.table)
				.where({ id })
				.first()
				.then(res => new Keyword(convertDataValues(res)))
				.catch(err => err);
		}

		return this.db(this.table)
			.then(res => res?.map(i => new Keyword(convertDataValues(i))))
			.catch(err => err);
	}

	async delete(filter: number | string) {
		try {
			const fromDb =
				typeof filter === 'number'
					? await this.db(this.table).where({ id: filter }).first()
					: await this.db(this.table).where({ name: filter }).first();

			if (!fromDb) return { message: 'Keyword not found', status: BAD_REQUEST };

			await this.db(this.table).where({ id: fromDb.id }).del();

			return { message: 'Keyword deleted', data: convertDataValues(fromDb) };
		} catch (err) {
			return err;
		}
	}
}
