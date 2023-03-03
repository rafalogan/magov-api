import { BAD_REQUEST, NOT_FOUND } from 'http-status';

import { IPlan, IServiceOptions } from 'src/repositories/types';
import { DatabaseService } from './abistract-database.service';
import { Plan } from 'src/repositories/entities';
import { convertDataValues } from 'src/utils';
import { ReadOptionsModel } from 'src/repositories/models';

export class PlanService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: Plan) {
		try {
			const fromDB = (await this.getPlan(data.name)) as Plan;

			if (fromDB?.id) return { message: 'Plan already exists', status: BAD_REQUEST };
			const [id] = await this.db('plans').insert(convertDataValues(data));

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

			await this.db('plans').where({ id }).update(convertDataValues(plan));

			return { message: 'Plan update successfully', data: plan };
		} catch (err) {
			return err;
		}
	}

	async read(options: ReadOptionsModel, id?: number) {
		if (id) return this.getPlan(id);

		return this.findAll('plans', options)
			.then(res => {
				const data = res.data?.map((p: IPlan) => new Plan(p));
				return { ...res, data };
			})
			.catch(err => err);
	}

	async getPlan(filter: string | number) {
		try {
			const fromDb = await this.db('plans').where({ id: filter }).orWhere({ name: filter }).first();

			if (!fromDb?.id) return { message: 'Plan not found', status: NOT_FOUND };

			return new Plan(convertDataValues(fromDb, 'camel'));
		} catch (err) {
			return err;
		}
	}

	async delete(id: number) {
		try {
			const fromDB = (await this.getPlan(id)) as Plan;

			if (!fromDB?.id) return { message: 'Plan not found', status: NOT_FOUND };

			await this.db('plans').where({ id }).del();
			return { message: 'Plan deleted successfully', data: { ...fromDB } };
		} catch (err) {
			return err;
		}
	}
}
