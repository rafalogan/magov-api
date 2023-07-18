import { BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';
import { onLog } from 'src/core/handlers';
import { ContactModel, PaginationModel, ReadOptionsModel } from 'src/repositories/models';

import { IServiceOptions } from 'src/repositories/types';
import { convertDataValues, existsOrError, isRequired } from 'src/utils';
import { DatabaseService } from './abistract-database.service';

export class ContactService extends DatabaseService {
	tables = { c: 'contacts', p: 'plaintiffs', a: 'adresses' };
	fields = [
		{
			id: 'c.id',
			email: 'c.email',
			phone: 'c.phone',
			tenancy_id: 'c.tenancy_id',
			active: 'c.active',
			plaintiff_id: 'c.plaintiff_id',
		},
		{ plaintiff: 'p.name', institute: 'p.institute' },
		{ city: 'a.city', uf: 'a.uf' },
	];

	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: any) {
		return { message: 'Forbidden', data, status: FORBIDDEN };
	}

	async update(data: any, id: any): Promise<any> {
		return { message: 'Forbidden', data: { ...data, id }, status: FORBIDDEN };
	}

	async read(options: ReadOptionsModel, id?: number) {
		try {
			const { limit, orderBy, order, tenancyId } = options;
			existsOrError(tenancyId, { message: isRequired('tenancyId'), status: BAD_REQUEST });

			if (id) return this.getContact(id, tenancyId as number);

			const page = options.page || 1;
			const total = await this.getCount('contacts', tenancyId);
			const pagination = new PaginationModel({ page, limit, total });
			onLog('tenancyId', tenancyId);

			return this.db({ ...this.tables, d: 'demands' })
				.select(...this.fields, { demand: 'd.name' })
				.where('c.tenancy_id', tenancyId)
				.andWhereRaw('d.plaintiff_id = c.plaintiff_id')
				.andWhereRaw('p.id = c.plaintiff_id')
				.andWhereRaw('a.plaintiff_id = c.plaintiff_id')
				.limit(limit)
				.offset(page * limit - limit)
				.orderBy(orderBy || 'id', order || 'asc')
				.then(res => {
					existsOrError(Array.isArray(res), { message: 'Internal error', error: res, status: INTERNAL_SERVER_ERROR });
					const data = res.map(i => new ContactModel(convertDataValues(i, 'camel')));

					return { data, pagination };
				})
				.catch(err => err);
		} catch (err) {
			return err;
		}
	}

	async getContact(id: number, tenancyId: number) {
		try {
			const fromDB = await this.db(this.tables)
				.select(...this.fields)
				.where('c.id', id)
				.andWhere('c.tenancy_id', tenancyId)
				.andWhereRaw('p.id = c.plaintiff_id')
				.andWhereRaw('a.plaintiff_id = c.plaintiff_id')
				.first();

			existsOrError(fromDB?.id, { message: 'Contact not found', status: NOT_FOUND });

			return new ContactModel(convertDataValues(fromDB, 'camel'));
		} catch (err) {
			return err;
		}
	}

	async disable() {
		return { message: 'Forbidden', status: FORBIDDEN };
	}
}
