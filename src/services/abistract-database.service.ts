import { Knex } from 'knex';
import { INTERNAL_SERVER_ERROR } from 'http-status';

import { onLog } from 'src/core/handlers';
import { PaginationModel, ReadOptionsModel } from 'src/repositories/models';
import { IAddress, IGetValuesOptions, ISaleProduct, IServiceOptions } from 'src/repositories/types';
import { camelToSnake, convertDataValues, existsOrError, notExistisOrError } from 'src/utils';
import { CacheService } from './abistract-cache.service';
import { Address, FileEntity } from 'src/repositories/entities';

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
		const { limit, orderBy, order } = options;
		const page = options.page || 1;
		const total = (await this.getCount(tableName)) as number;
		const pagination = new PaginationModel({ page, limit, total });

		return this.db(tableName)
			.limit(limit)
			.offset(page * limit - limit)
			.orderBy(orderBy || 'id', order || 'asc')
			.then(data => (!data ? {} : { data: data.map(i => convertDataValues(i, 'camel')), pagination }))
			.catch(err => err);
	}

	async findAllByTenacy(tableName: string, options: ReadOptionsModel) {
		const { limit, tenancyId: tenancy_id, orderBy, order } = options;
		const page = options?.page || 1;
		const total = (await this.getCount(tableName, tenancy_id)) as number;
		const pagination = new PaginationModel({ page, limit, total });

		return this.db(tableName)
			.where({ tenancy_id })
			.limit(limit)
			.offset(page * limit - limit)
			.orderBy(orderBy || 'id', order || 'asc')
			.then(data => (!data ? {} : { data: data.map(i => convertDataValues(i, 'camel')), pagination }))
			.catch(err => err);
	}

	async setAddress(address: any, where: string, value: any) {
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

	protected async setPlanOnTenancy(tenancyId: number, plans: ISaleProduct[]) {
		try {
			for (const plan of plans) {
				const { id: planId, amount } = plan;
				const fromDB = await this.db('tenancies_plans').where('plan_id', planId).andWhere('tenancy_id', tenancyId).first();
				onLog('tenancies plans from DB', fromDB);
				notExistisOrError(fromDB?.severity === 'ERROR', { message: 'internal error', err: fromDB, status: INTERNAL_SERVER_ERROR });

				const raw = fromDB?.plan_id ? convertDataValues(fromDB, 'camel') : undefined;

				onLog('tenancies plans raw', raw);

				if (raw?.planId) {
					const toUpdate = { ...raw, amount: raw.amount + amount };
					const res = await this.db('tenancies_plans')
						.where('plan_id', planId)
						.andWhere('tenancy_id', tenancyId)
						.update(convertDataValues(toUpdate));

					onLog('response to update', res);

					existsOrError(Number(res), { message: 'Internal console error', err: res, status: INTERNAL_SERVER_ERROR });
				} else {
					const toSave = { tenancyId, planId, amount };
					const res = await this.db('tenancies_plans').insert(convertDataValues(toSave));

					onLog('response to save', res);

					existsOrError(Number(res), { message: 'Internal console error', err: res, status: INTERNAL_SERVER_ERROR });
				}
			}
		} catch (err) {
			return err;
		}
	}

	protected async favoriteItem(tableName: string, id: number) {
		try {
			const fromDb = await this.db(tableName).where({ id }).first();

			existsOrError(fromDb?.id, { message: 'Not Found', status: INTERNAL_SERVER_ERROR });
			await this.db(tableName)
				.where({ id })
				.update({ ...fromDb, favorite: true });

			return { message: `Register nº ${id} favorite` };
		} catch (err) {
			return err;
		}
	}

	protected async setPayment(form: string) {
		try {
			const fromDb = await this.db('payments').where({ form }).first();
			if (Number(fromDb?.id)) return Number(fromDb.id);

			const [id] = await this.db('payments').insert(convertDataValues({ form }));
			existsOrError(Number(id), { message: 'Internal Error', err: id, status: INTERNAL_SERVER_ERROR });

			return Number(id);
		} catch (err) {
			return err;
		}
	}

	protected async setFile(data: any, where: string, value: any) {
		try {
			const fromDb = await this.db('files').where(camelToSnake(where), value).first();

			if (fromDb?.id) {
				const toUpdate = new FileEntity(data);
				toUpdate[where] = value;
				await this.db('files').update(convertDataValues(toUpdate)).where(camelToSnake(where), value);

				return toUpdate;
			}

			const toSave = new FileEntity(data);
			toSave[where] = value;

			const [id] = await this.db('files').insert(convertDataValues(toSave));
			existsOrError(Number(id), { message: 'Internal Error', err: id, status: INTERNAL_SERVER_ERROR });

			return { ...toSave, id };
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
			const fields = await this.db(options.tableIds).select(options.fieldIds).where(options.whereIds, options.value);
			const ids = fields.map(i => i[options.fieldIds]);

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
