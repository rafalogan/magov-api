import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';

import { IPlan, IServiceOptions } from 'src/repositories/types';
import { DatabaseService } from './abistract-database.service';
import { Plan } from 'src/repositories/entities';
import { convertDataValues, existsOrError } from 'src/utils';
import { PlanModel, ReadOptionsModel } from 'src/repositories/models';
import { onLog } from 'src/core/handlers';

export class ProductService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: Plan) {
		try {
			const fromDB = (await this.getPlan(data.name)) as Plan;

			if (fromDB?.id) return { message: 'Plan already exists', status: BAD_REQUEST };
			const [id] = await this.db('products').insert(convertDataValues({ ...data, active: true }));

			return { message: 'Plan save with success', data: { ...data, id } };
		} catch (err) {
			return err;
		}
	}

	async update(data: Plan, id: number) {
		try {
			const fromDB = await this.getPlan(id);

			if (!fromDB) return { message: 'Plan not found', status: BAD_REQUEST };
			const plan = new Plan({ ...fromDB, ...data } as IPlan);

			await this.db('products').where({ id }).update(convertDataValues(plan));

			return { message: 'Plan update successfully', data: plan };
		} catch (err) {
			return err;
		}
	}

	async read(options: ReadOptionsModel, id?: number) {
		onLog('plans opitons', options);
		if (id) return this.getPlan(id);

		return this.db('products')
			.then(res => {
				try {
					existsOrError(Array.isArray(res), { message: 'internal error', err: res, status: INTERNAL_SERVER_ERROR });
				} catch (err) {
					return err;
				}

				return res.map((p: any) => new PlanModel(p));
			})
			.catch(err => err);
	}

	async getPlan(filter: string | number) {
		try {
			const fromDb = await this.db('products').where({ id: filter }).orWhere({ name: filter }).first();

			if (!fromDb?.id) return { message: 'Plan not found', status: NOT_FOUND };

			return new PlanModel(convertDataValues(fromDb, 'camel'));
		} catch (err) {
			return err;
		}
	}

	async delete(id: number) {
		try {
			const fromDB = (await this.getPlan(id)) as Plan;

			if (!fromDB?.id) return { message: 'Plan not found', status: NOT_FOUND };

			await this.db('products')
				.where({ id })
				.update(convertDataValues({ ...fromDB, active: false }));
			return { message: 'Plan deleted successfully', data: { ...fromDB } };
		} catch (err) {
			return err;
		}
	}
}
