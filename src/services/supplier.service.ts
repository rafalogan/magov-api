import { BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';

import { IServiceOptions } from 'src/repositories/types';
import { DatabaseService } from './abistract-database.service';
import { ReadOptionsModel } from 'src/repositories/models';
import { convertDataValues, existsOrError, isRequired, notExistisOrError } from 'src/utils';
import { Supplier } from 'src/repositories/entities';

export class SupplierService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: Supplier) {
		try {
			const fromDB = (await this.getSupplier(data.name, data.tenancyId)) as any;
			notExistisOrError(fromDB?.id, { message: 'Supplier already exists', status: FORBIDDEN });

			const [id] = await this.db('suppliers').insert(convertDataValues(data));
			existsOrError(Number(id), { message: 'Internal error', status: INTERNAL_SERVER_ERROR, err: id });

			return { message: 'Supplier sucssecful saved', data: { ...data, id } };
		} catch (err) {
			return err;
		}
	}

	async update(data: Supplier, id: number) {
		try {
			const fromDB = (await this.getSupplier(id, data.tenancyId)) as Supplier;
			existsOrError(fromDB?.id, fromDB);

			const toUpdate = { ...fromDB, ...data, tenancyId: fromDB.tenancyId };
			await this.db('suppliers').where({ id }).andWhere('tenancy_id', data.tenancyId).update(convertDataValues(toUpdate));

			return { message: 'Supplier updated successfully', data: toUpdate };
		} catch (err) {
			return err;
		}
	}

	async read(options: ReadOptionsModel, id?: number) {
		try {
			const { tenancyId } = options;
			existsOrError(tenancyId, { message: isRequired('tenancyId'), status: BAD_REQUEST });

			if (id) return this.getSupplier(id, tenancyId as number);

			const fromDB = await this.db('suppliers').where('tenancy_id');
			existsOrError(Array.isArray(fromDB), { message: 'internal error', status: INTERNAL_SERVER_ERROR, err: fromDB });

			return fromDB.map(item => new Supplier(convertDataValues(item)));
		} catch (err) {
			return err;
		}
	}

	async getSupplier(filter: number | string, tenancyId: number) {
		try {
			const fromDB = await this.db('suppliers').where('tenancy_id', tenancyId).orWhere('id', filter).orWhere('name', filter).first();

			existsOrError(fromDB?.id, { message: 'Supplier not found', status: NOT_FOUND });
			notExistisOrError(fromDB.severity === 'ERROR', { message: 'Internal error', status: INTERNAL_SERVER_ERROR, err: fromDB });

			return new Supplier(convertDataValues(fromDB, 'camel'));
		} catch (err) {
			return err;
		}
	}

	async delete(id: number) {
		return Promise.reject({ id, message: 'Method not implemented', status: FORBIDDEN });
	}
}
