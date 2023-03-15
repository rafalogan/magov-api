import { Knex } from 'knex';
import { onLog } from 'src/core/handlers';
import { PaginationModel, ReadOptionsModel } from 'src/repositories/models';

import { IAddress, IGetValuesOptions, IServiceOptions } from 'src/repositories/types';
import { camelToSnake, convertDataValues } from 'src/utils';
import { CacheService } from './abistract-cache.service';
import { Address } from 'src/repositories/entities';

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

	async setAddress(address: Address, where: string, value: any) {
		try {
			const fromDb = await this.db('adresses').where(camelToSnake(where), value).first();
			onLog('adress from db', fromDb);

			if (!fromDb) {
				address[where] = value;
				onLog('addres to save', address);
				const [id] = await this.db('adresses').insert(convertDataValues(address));
				return { ...address, id };
			}
			const data = new Address({ ...fromDb, ...address } as IAddress);

			await this.db('adresses').where(camelToSnake(where), value).update(convertDataValues(data));
			return data;
		} catch (err) {
			return err;
		}
	}

	protected async findAllDadaByArray(table: string, ids: number[]) {
		try {
			if (!ids?.length) return [];
			const result: any = [];
			for (const id of ids) {
				const item = await this.db(table).where({ id }).first();
				result.push(convertDataValues(item, 'camel'));
			}

			return result;
		} catch (err) {
			return err;
		}
	}

	protected async getValues(options: IGetValuesOptions) {
		try {
			const ids = await this.db(options.tableIds).select(options.fieldIds).where(options.whereIds, options.value);
			if (!Array.isArray(ids)) return [];

			const result: any[] = [];
			for (const itemId of ids) {
				const data = await this.db(options.table)
					.select(...options.fields)
					.where('id', itemId)
					.first();
				if (data.id) result.push(data);
			}

			return result;
		} catch (err) {
			return err;
		}
	}
}
