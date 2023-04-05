import { FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';

import { IServiceOptions } from 'src/repositories/types';
import { DatabaseService } from './abistract-database.service';
import { convertBlobToString, convertDataValues, existsOrError, notExistisOrError } from 'src/utils';

export class PaymentFormService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: any) {
		return Promise.reject({ message: 'Method not implemented', data, status: FORBIDDEN });
	}

	async update(data: any, id: any) {
		return Promise.reject({ message: 'Method not implemented', data: { ...data, id }, status: FORBIDDEN });
	}

	async read(id?: number) {
		try {
			if (id) return this.getPaymentForm(id);
			const fromDB = await this.db('payments');

			existsOrError(Array.isArray(fromDB), { message: 'Internal error', err: fromDB, status: INTERNAL_SERVER_ERROR });
			const res: any[] = [];
			for (const item of fromDB) {
				const description = convertBlobToString(item.description);
				res.push({ ...convertDataValues(item, 'camel'), description });
			}

			return res;
		} catch (err) {
			return err;
		}
	}

	async getPaymentForm(filter: string | number) {
		try {
			const fromDB = await this.db('payments').where({ id: filter }).orWhere({ form: filter }).first();

			existsOrError(fromDB?.id, { messages: 'Payment Form not found', status: NOT_FOUND });
			notExistisOrError(fromDB.severity === 'ERROR', { message: 'Internal error', status: INTERNAL_SERVER_ERROR, err: fromDB });
			const res = convertDataValues(fromDB, 'camel');
			res.description = convertBlobToString(res.description);

			return res;
		} catch (err) {
			return err;
		}
	}

	async delete(id: number) {
		return Promise.reject({ message: 'Method not implemented', id, status: FORBIDDEN });
	}
}
