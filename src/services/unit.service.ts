import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';
import { onLog } from 'src/core/handlers';

import { Unit } from 'src/repositories/entities';
import { ReadOptionsModel, UnitModel } from 'src/repositories/models';
import { IServiceOptions, IUnit } from 'src/repositories/types';
import { convertBlobToString, convertDataValues, existsOrError } from 'src/utils';
import { DatabaseService } from './abistract-database.service';

export class UnitService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: UnitModel) {
		try {
			const unit = new Unit({ ...data, planId: data.plan.id, active: true } as IUnit);
			const [id] = await this.db('units').insert(convertDataValues(unit));

			existsOrError(Number(id), { message: 'Internal error', error: id, status: INTERNAL_SERVER_ERROR });

			await this.setAddress({ ...data.address, unitId: id }, 'unitId', Number(id));

			return { message: 'Unit created successfully.', unit: { ...data, id } };
		} catch (err) {
			return err;
		}
	}

	async update(data: UnitModel, id: number) {
		try {
			const unit = (await this.getUnit(id, data.tenancyId)) as UnitModel;

			existsOrError(unit?.id, unit);

			const toSave = new Unit({ ...unit, ...data, tenancyId: unit.tenancyId, planId: data.plan.id || unit.plan.id });
			onLog('unit to save', toSave);

			await this.db('units').where({ id }).andWhere('tenancy_id', unit.tenancyId).update(convertDataValues(toSave));
			if (data.address) await this.setAddress({ ...data.address, unitId: unit.id }, 'unitId', unit.id);

			return { message: 'Unit updated successfully.', unit: { ...unit, ...data } };
		} catch (err) {
			return err;
		}
	}

	async read(options: ReadOptionsModel, id?: number) {
		const { tenancyId } = options;

		try {
			existsOrError(tenancyId, { message: tenancyId, status: BAD_REQUEST });
		} catch (err) {
			return err;
		}

		if (id) return this.getUnit(id, tenancyId as number);

		return this.db('units')
			.select('id', 'name', 'description')
			.where('tenancy_id', tenancyId)
			.then(res => {
				existsOrError(Array.isArray(res), { message: 'Internal Error', error: res, status: INTERNAL_SERVER_ERROR });
				return res.map(i => {
					i.description = convertBlobToString(i.description);
					return convertDataValues(i, 'camel');
				});
			})
			.catch(err => err);
	}

	async getUnit(id: number, tenancyId: number) {
		try {
			const unit = await this.db({ u: 'units', p: 'plans', a: 'adresses' })
				.select(
					{
						id: 'u.id',
						name: 'u.name',
						description: 'u.description',
						cnpj: 'u.cnpj',
						phone: 'u.phone',
						active: 'u.active',
						tenancy_id: 'u.tenancy_id',
					},
					{ plan_id: 'p.id', plan_name: 'p.name' },
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
				.where('u.id', id)
				.andWhere('u.tenancy_id', tenancyId)
				.andWhereRaw('p.id = u.plan_id')
				.andWhereRaw('a.unit_id = u.id')
				.first();

			existsOrError(unit?.id, { message: 'unit not found', status: NOT_FOUND });
			const raw = convertDataValues(unit, 'camel');

			return new UnitModel({
				...raw,
				plan: { id: raw.planId, name: raw.planName },
				address: {
					cep: raw.cep,
					street: raw.street,
					number: raw.number,
					complement: raw.complement,
					district: raw.district,
					city: raw.city,
					uf: raw.uf,
				},
			});
		} catch (err) {
			return err;
		}
	}

	async desactve(id: number, tenancyId: number) {
		try {
			const unit = (await this.getUnit(id, tenancyId)) as UnitModel;

			existsOrError(unit?.id, { message: 'Unit not found', status: NOT_FOUND });
			existsOrError(unit.active, { message: 'Unit already desactved.', status: BAD_REQUEST });

			const toDisabled = new Unit({ ...unit, planId: unit.plan.id, active: false });
			onLog('unit to desactved', toDisabled);
			await this.db('units').where({ id }).andWhere('tenancy_id', tenancyId).update(convertDataValues(toDisabled));

			return { message: 'Unit successfully desactved.', unit: { ...unit, active: false } };
		} catch (err) {
			return err;
		}
	}
}
