import { INTERNAL_SERVER_ERROR } from 'http-status';

import { IPlan, IServiceOptions } from 'src/repositories/types';
import { Plan } from 'src/repositories/entities';
import { convertDataValues, existsOrError } from 'src/utils';
import { PlanModel, ReadOptionsModel } from 'src/repositories/models';
import { onLog } from 'src/core/handlers';
import { ProductService } from './product.service';

export class PlanService extends ProductService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: Plan) {
		try {
			const fromDB = (await this.getProduct(data.name)) as PlanModel;

			existsOrError(fromDB?.id, fromDB);

			const [id] = await this.db('products').insert(convertDataValues({ ...data, plan: true, active: true }));

			return { message: 'Plan save with success', data: { ...data, id } };
		} catch (err) {
			return err;
		}
	}

	async update(data: Plan, id: number) {
		try {
			const fromDB = (await this.getProduct(id)) as PlanModel;

			existsOrError(fromDB?.id, fromDB);

			const plan = new Plan({ ...fromDB, ...data, plan: true } as IPlan);

			await super.update(plan, id);
			return { message: 'Plan update successfully', data: plan };
		} catch (err) {
			return err;
		}
	}

	async read(options: ReadOptionsModel, id?: number) {
		onLog('plans opitons', options);
		if (id) return this.getProduct(id);

		return this.db('products')
			.where({ plan: true })
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
}
