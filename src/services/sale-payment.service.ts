import { INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';

import { ISalePayment, IServiceOptions } from 'src/repositories/types';
import { DatabaseService } from './abistract-database.service';
import { convertDataValues, existsOrError } from 'src/utils';
import { SalePaymentModel } from 'src/repositories/models';
import { SalePayment } from 'src/repositories/entities';

export class SalePaymentService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: SalePaymentModel) {
		const toSave = new SalePayment(data);

		return this.db('sales_payments')
			.insert(convertDataValues(toSave))
			.then(([id]) => {
				try {
					existsOrError(Number(id), { message: 'Internal error', status: INTERNAL_SERVER_ERROR, err: id });
				} catch (err) {
					return err;
				}

				return { ...data, id };
			})
			.catch(err => err);
	}

	async update(data: SalePaymentModel, id: number) {
		try {
			const fromDB = (await this.getSalePayment(id)) as SalePaymentModel;

			existsOrError(fromDB?.id, fromDB);
			const toUpdate = new SalePayment({ ...fromDB, ...data });

			await this.db('sales_payments').where({ id }).update(convertDataValues(toUpdate));

			return toUpdate;
		} catch (err) {
			return err;
		}
	}

	async read(saleId?: number, id?: number) {
		try {
			if (Number(id)) return this.getSalePayment(id as number);

			const FromDB = Number(saleId) ? await this.db('sales_payments').where('sale_id', saleId) : await this.db('sales_payments');
			existsOrError(Array.isArray(FromDB), { message: 'Internal error', err: FromDB, status: INTERNAL_SERVER_ERROR });

			return FromDB.map((i: ISalePayment) => new SalePaymentModel(convertDataValues(i, 'camel')));
		} catch (err) {
			return err;
		}
	}

	async getSalePayment(id: number) {
		try {
			const fromDB = await this.db('sales_payments').where({ id }).first();
			existsOrError(fromDB, { message: 'Internal Error', status: INTERNAL_SERVER_ERROR, err: fromDB });
			existsOrError(fromDB?.id, { message: 'Not found', status: NOT_FOUND });

			return new SalePaymentModel(convertDataValues(fromDB, 'camel'));
		} catch (err) {
			return err;
		}
	}

	async delete(id: number) {
		try {
			const fromDB = (await this.getSalePayment(id)) as SalePaymentModel;
			existsOrError(fromDB?.id, fromDB);
			await this.db('sales_payments').where({ id }).del();

			return { message: 'Payment deleted successfully', data: fromDB };
		} catch (err) {
			return err;
		}
	}
}
