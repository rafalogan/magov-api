import { BAD_REQUEST, NOT_FOUND, NO_CONTENT } from 'http-status';

import { Unit } from 'src/repositories/entities';
import { ReadOptionsModel, UnitModel } from 'src/repositories/models';
import { IServiceOptions, IUnit } from 'src/repositories/types';
import { convertBlobToString, convertDataValues } from 'src/utils';
import { DatabaseService } from './abistract-database.service';

export class UnitService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: UnitModel) {
		try {
			const unit = new Unit(data as IUnit);
			const [id] = await this.db('units').insert(convertDataValues(unit));
			await this.setAddress(data.address, 'unitId', Number(id));

			return { message: 'Unit created successfully.', unit: { ...data, id } };
		} catch (err) {
			return err;
		}
	}

	async update(data: UnitModel, id: number) {
		try {
			const unit = await this.getUnit(id);

			if (!unit) return { message: 'Unit not found', status: NOT_FOUND };
			const toSave = new Unit({ ...unit, ...data });

			await this.db('units').where({ id }).update(convertDataValues(toSave));
			if (data.address) {
				await this.db('adresses')
					.where({ unit_id: id })
					.update(convertDataValues({ ...unit.address, ...data.address }));
			}

			return { message: 'Unit updated successfully.', unit: { ...unit, ...data } };
		} catch (err) {
			return err;
		}
	}

	async read(options: ReadOptionsModel, id: number) {
		if (id) return this.getUnit(id);

		if (!options.tenancyId) return { message: 'tenancyId is required', status: BAD_REQUEST };

		return this.findAllByTenacy('units', options)
			.then(res => {
				const data = res?.data?.map(this.setUnits);
				return { ...res, data };
			})
			.catch(err => err);
	}

	async getUnit(id: Number) {
		try {
			const unit = await this.db('units').where({ id }).first();

			if (!unit) return unit;
			const address = await this.db('adresses').where({ unit_id: unit.id }).first();

			return new UnitModel({ ...convertDataValues(unit, 'camel'), address: convertDataValues(address, 'camel') });
		} catch (err) {
			return err;
		}
	}

	async desactve(id: number) {
		try {
			const unit = await this.getUnit(id);

			if (!unit) return { message: 'Unit not found', status: NOT_FOUND };
			if (!unit.active) return { message: 'Unit already desactved.', status: BAD_REQUEST };

			await this.db('units')
				.where({ id })
				.update(convertDataValues({ ...unit, active: false }));

			return { message: 'Unit successfully desactved.', unit: { ...unit, active: false } };
		} catch (err) {
			return err;
		}
	}

	private setUnits(unit: IUnit) {
		const { id, name, description } = unit;
		return { id, name, description: convertBlobToString(description) };
	}
}
