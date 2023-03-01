import { Knex } from 'knex';
import { PaginationModel, ReadOptionsModel } from 'src/repositories/models';

import { IServiceOptions } from 'src/repositories/types';
import { convertDataValues } from 'src/utils';
import { CacheService } from './abistract-cache.service';

export abstract class DatabaseService extends CacheService {
	protected db: Knex;

	constructor(options: IServiceOptions) {
		super(options.cacheClient);

		this.db = options.conn;
	}

	save(data: any) {
		return data.id ? this.update(data, data.id) : this.create(data);
	}

	abstract create(data: any): Promise<any>;

	abstract update(data: any, id: any): Promise<any>;

	async getCount(tableName: string, tenacy?: number) {
		if (tenacy) {
			return this.db(tableName)
				.count({ count: 'id' })
				.where({ tenancy_id: tenacy })
				.first()
				.then(res => Number(res?.count))
				.catch(err => err);
		}

		return this.db(tableName)
			.count({ count: 'id' })
			.first()
			.then(res => Number(res?.count))
			.catch(err => err);
	}

	async findAll(tableName: string, options: ReadOptionsModel) {
		const { limit, page, orderBy, order } = options;
		const total = (await this.getCount(tableName)) as number;
		const pagination = new PaginationModel({ page, limit, total });

		return this.db(tableName)
			.limit(limit)
			.offset(page * limit - limit)
			.orderBy(orderBy, order)
			.then(data => (!data ? {} : { data: data.map(i => convertDataValues(i, 'camel')), pagination }))
			.catch(err => err);
	}

	async findAllByTenacy(tableName: string, options: ReadOptionsModel) {
		const { limit, page, tenancyId: tenancy_id, orderBy, order } = options;
		const total = (await this.getCount(tableName, tenancy_id)) as number;
		const pagination = new PaginationModel({ page, limit, total });

		return this.db(tableName)
			.where({ tenancy_id })
			.limit(limit)
			.offset(page * limit - limit)
			.orderBy(orderBy, order)
			.then(data => (!data ? {} : { data: data.map(i => convertDataValues(i, 'camel')), pagination }))
			.catch(err => err);
	}
}
