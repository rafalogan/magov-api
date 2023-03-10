import { FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';
import { Plaintiff } from 'src/repositories/entities';

import { PaginationModel, PlaintiffModel, ReadOptionsModel } from 'src/repositories/models';
import { IPlantiff, IServiceOptions } from 'src/repositories/types';
import { convertDataValues, equalsOrError, existsOrError, isRequired, notExistisOrError } from 'src/utils';
import { DatabaseService } from './abistract-database.service';

export class PlaintiffService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: PlaintiffModel) {
		try {
			const fromBD = await this.getPlaintiff(data.cpfCnpj, data.tenancyId as number);

			notExistisOrError(fromBD.id, { message: 'Plaintiff already exists', status: FORBIDDEN });
			const toSave = new Plaintiff({ ...data } as IPlantiff);
			const [id] = await this.db('plaintiffs').insert(convertDataValues(toSave));
			existsOrError(Number(id), { message: 'Internal server error', err: id, status: INTERNAL_SERVER_ERROR });

			const [addressId] = await this.db('adresses').insert(convertDataValues(data.address));
			existsOrError(Number(addressId), { message: 'Internal server error', err: addressId, status: INTERNAL_SERVER_ERROR });

			const [contactId] = await this.db('contacts').insert(convertDataValues({ email: data.email, phone: data.phone }));
			existsOrError(Number(contactId), { message: 'Internal server error', err: contactId, status: INTERNAL_SERVER_ERROR });

			return { message: 'Plantiff saved successfully', data: { ...data, id, address: { ...data.address, id: addressId }, contactId } };
		} catch (err) {
			return err;
		}
	}

	async update(data: PlaintiffModel, id: number) {
		try {
			const fromBD = await this.getPlaintiff(id, data.tenancyId as number);

			existsOrError(fromBD?.id, { message: 'Plaintiffs not found', status: NOT_FOUND });
			equalsOrError(fromBD.tenancyId, data.tenancyId, { message: 'forbidden user action', status: FORBIDDEN });

			const toUpdate = new Plaintiff({ ...fromBD, ...data, tenancyId: fromBD.tenancyId });
			await this.db('plaintiffs').where({ id }).andWhere({ tenancy_id: data.tenancyId }).update(convertDataValues(toUpdate));
			await this.db('address')
				.where({ plaintiff_id: fromBD.id })
				.update(convertDataValues({ ...fromBD.address, ...data.address }));
			await this.db('contacts')
				.where({ plaintiff_id: fromBD.id })
				.update(convertDataValues({ email: data.email || fromBD.email, phone: data.phone || fromBD.phone }));

			return { message: 'Plaintiff updated', data: { ...fromBD, ...data, tenancyId: fromBD.tenancyId } };
		} catch (err) {
			return err;
		}
	}

	async read(options: ReadOptionsModel, id?: number) {
		try {
			const { page, limit, order, orderBy, tenancyId } = options;
			existsOrError(tenancyId, { message: isRequired('Query param tenancyId'), status: FORBIDDEN });

			if (id) return this.getPlaintiff(id, options.tenancyId as number);

			const total = await this.getCount('plaintiffs', tenancyId);
			const pagination = new PaginationModel({ page, limit, total });

			return this.db('plaintiffs')
				.select('id', 'name', 'cpf_cnpj', 'institute', 'institute_type_id')
				.where({ tenancy_id: tenancyId })
				.limit(limit)
				.offset(page * limit - limit)
				.orderBy(orderBy || 'id', order || 'asc')
				.then(res => {
					existsOrError(Array.isArray(res), { message: 'Internal error', status: INTERNAL_SERVER_ERROR });
					const data = res.map(i => convertDataValues({ ...i, id: Number(i.id), institute_type_id: Number(i.institute_type_id) }, 'camel'));
					return { data, pagination };
				})
				.catch(err => err);
		} catch (err) {
			return err;
		}
	}

	async getPlaintiff(value: number | string, tenancyId: number) {
		try {
			const fromBD = await this.db({ p: 'plaintiffs', c: 'contacts', a: 'adresses' })
				.select(
					{
						id: 'p.id',
						name: 'p.name',
						birthday: 'p.birthday',
						cpf_cnpj: 'p.cpf_cnpj',
						institute: 'p.institute',
						relationship_type: 'p.relationship_type',
						observation: 'p.observation',
						relatives: 'p.relatives',
						voter_registration: 'p.voter_registration',
						parent_id: 'p.parent_id',
						institute_type_id: 'p.institute_type_id',
						tenancy_id: 'p.tenancy_id',
					},
					{ email: 'c.email', phone: 'c.phone' },
					{
						cep: 'a.cep',
						street: 'a.street',
						number: 'a.number',
						complement: 'a.complement',
						district: 'a.district',
						city: 'a.city',
						uf: 'a.uf',
					}
				)
				.where('p.id', value)
				.orWhere('p.cpf_cnpj', value)
				.andWhere('p.tenancy_id', tenancyId)
				.andWhere('c.plaintiff_id', 'p.id')
				.andWhere('a.plaintiff_id', 'p.id')
				.first();

			existsOrError(fromBD?.id, { message: 'Plaintiffs not found', status: NOT_FOUND });

			return new PlaintiffModel(convertDataValues({ ...fromBD, address: { ...fromBD, id: undefined } }, 'camel'));
		} catch (err: any) {
			return err;
		}
	}

	async disable(id: number, tenancyId: number) {
		try {
			const fromBD = await this.getPlaintiff(id, tenancyId);
			existsOrError(fromBD?.id, { message: 'Plaintiffs not found', status: NOT_FOUND });
			const toDesabled = new Plaintiff({ ...fromBD, active: false });

			await this.db('plaintiffs').where({ id }).andWhere({ tenancy_id: tenancyId }).update(convertDataValues(toDesabled));

			return { message: 'Plaintiffs deleted', data: { ...fromBD, active: false } };
		} catch (err) {
			return err;
		}
	}
}
