import { FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';

import { IPlan, IServiceOptions } from 'src/repositories/types';
import { DatabaseService } from './abistract-database.service';
import { Plan } from 'src/repositories/entities';
import { convertDataValues, existsOrError, notExistisOrError } from 'src/utils';
import { PlanModel, ProductViewModel, ReadOptionsModel } from 'src/repositories/models';
import { onLog } from 'src/core/handlers';

export class ProductService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: Plan) {
		try {
			const fromDB = (await this.getProduct(data.name)) as any;

			notExistisOrError(fromDB?.id, { message: 'Product already exists', status: FORBIDDEN });
			const [id] = await this.db('products').insert(convertDataValues({ ...data, active: true }));

			return { message: 'Product successfully saved', data: { ...data, id } };
		} catch (err) {
			return err;
		}
	}

	async update(data: Plan, id: number) {
		try {
			const fromDB = (await this.getProduct(id)) as Plan;

			existsOrError(fromDB?.id, { message: 'Products not found', status: NOT_FOUND });
			const plan = new Plan({ ...fromDB, ...data, active: !!data.active || true } as IPlan);

			await this.db('products').where({ id }).update(convertDataValues(plan));

			return { message: 'Products update successfully', data: new PlanModel(plan, id) };
		} catch (err) {
			return err;
		}
	}

	async read(options: ReadOptionsModel, id?: number) {
		onLog('Products opitons', options);
		if (id) return this.getProduct(id);

		try {
			const fromDB = await this.db({ p: 'products', pt: 'products_types' })
				.select('p.*', { type: 'pt.type' })
				.whereRaw('pt.id = p.type_id');
			existsOrError(Array.isArray(fromDB), { message: 'internal error', err: fromDB, status: INTERNAL_SERVER_ERROR });

			return fromDB.map((i: any) => new ProductViewModel(convertDataValues(i, 'camel')));
		} catch (err) {
			return err;
		}
	}

	async getProduct(filter: string | number) {
		try {
			const fromDb = await this.db('products').where({ id: filter }).orWhere({ name: filter }).first();

			existsOrError(fromDb?.id, { message: 'Product not found', status: NOT_FOUND });

			return new PlanModel(convertDataValues(fromDb, 'camel'));
		} catch (err) {
			return err;
		}
	}

	async delete(id: number) {
		try {
			const fromDB = (await this.getProduct(id)) as Plan;

			existsOrError(fromDB?.id, fromDB);
			existsOrError(fromDB.active, { message: 'Product already desactivated', status: FORBIDDEN });
			const toDisabled = new Plan({ ...convertDataValues(fromDB, 'camel'), active: false });

			await this.db('products').where({ id }).update(convertDataValues(toDisabled));
			return { message: 'Plan deleted successfully', data: toDisabled };
		} catch (err) {
			return err;
		}
	}
}
