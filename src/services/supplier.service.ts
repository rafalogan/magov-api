import { Request } from 'express';
import { BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';

import { IServiceOptions } from 'src/repositories/types';
import { DatabaseService } from './abistract-database.service';
import { ReadOptionsModel } from 'src/repositories/models';
import { convertBlobToString, convertDataValues, existsOrError, isRequired, notExistisOrError } from 'src/utils';
import { Supplier } from 'src/repositories/entities';
import { getUserLogData } from 'src/core/handlers';

export class SupplierService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: Supplier, req: Request) {
		try {
			const fromDB = (await this.getSupplier(data.name, data.tenancyId)) as any;
			notExistisOrError(fromDB?.id, { message: 'Supplier already exists', status: FORBIDDEN });

			const [id] = await this.db('suppliers').insert(convertDataValues(data));
			existsOrError(Number(id), { message: 'Internal error', status: INTERNAL_SERVER_ERROR, err: id });
			await this.userLogService.create(getUserLogData(req, 'suppliers', id, 'salvar'));

			return { message: 'Supplier sucssecful saved', data: { ...data, id } };
		} catch (err) {
			return err;
		}
	}

	async update(data: Supplier, id: number, req: Request) {
		try {
			const fromDB = (await this.getSupplier(id, data.tenancyId)) as Supplier;
			existsOrError(fromDB?.id, fromDB);

			const toUpdate = { ...fromDB, ...data, tenancyId: fromDB.tenancyId };
			await this.db('suppliers').where({ id }).andWhere('tenancy_id', data.tenancyId).update(convertDataValues(toUpdate));
			await this.userLogService.create(getUserLogData(req, 'suppliers', id, 'atualizar'));

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

			const fromDB = await this.db('suppliers').select('id', 'name', 'description').where('tenancy_id', tenancyId);
			existsOrError(Array.isArray(fromDB), { message: 'internal error', status: INTERNAL_SERVER_ERROR, err: fromDB });

			return fromDB.map(item => {
				const description = convertBlobToString(item.description);
				return { ...convertDataValues(item, 'camel'), description };
			});
		} catch (err) {
			return err;
		}
	}

	async getSupplier(filter: number | string, tenancyId: number) {
		try {
			const fromDB =
				typeof filter === 'number'
					? await this.db('suppliers').where('tenancy_id', tenancyId).andWhere('id', filter).first()
					: await this.db('suppliers').where('tenancy_id', tenancyId).andWhere('name', filter).first();

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
