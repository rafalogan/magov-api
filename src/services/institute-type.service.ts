import { FORBIDDEN, NOT_FOUND } from 'http-status';
import { InstituteType } from 'src/repositories/entities';
import { IServiceOptions } from 'src/repositories/types';
import { convertDataValues } from 'src/utils';
import { DatabaseService } from './abistract-database.service';

export class InstituteTypeService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: InstituteType) {
		try {
			const fromDB = (await this.getInstituteType(data.name)) as InstituteType;

			if (fromDB.id) throw { message: 'Institute type already exists', status: FORBIDDEN };

			const [id] = await this.db('institutes_types').insert(convertDataValues(data));
			return { message: 'Institute type saved successfull', data: { ...data, id } };
		} catch (err) {
			return err;
		}
	}

	async update(data: InstituteType, id: number) {
		try {
			const fromDB = (await this.getInstituteType(id)) as InstituteType;
			if (!fromDB.id) throw { message: 'Institute type not found', status: NOT_FOUND };

			const institutiType = new InstituteType({ ...fromDB, ...data });

			await this.db('institutes_types').where({ id }).update(convertDataValues(institutiType));
			return { message: 'Institute type updated successfully', data: institutiType };
		} catch (err) {
			return err;
		}
	}

	async read(id?: number) {
		if (id) return this.getInstituteType(id);

		return this.db('institutes_types')
			.then(res => res?.map(r => new InstituteType(convertDataValues(r, 'camel'))))
			.catch(err => err);
	}

	async getInstituteType(value: number | string) {
		try {
			const fromDB = await this.db('institutes_types').where({ id: value }).orWhere({ name: value }).first();

			if (!fromDB.id) throw { message: 'Institute type not found', status: NOT_FOUND };

			return new InstituteType(convertDataValues(fromDB, 'camel'));
		} catch (err) {
			return err;
		}
	}

	async disable(id: number) {
		try {
			const fromDB = (await this.getInstituteType(id)) as InstituteType;
			if (!fromDB.id) throw { message: 'Institute type not found', status: NOT_FOUND };

			const toUpdate = new InstituteType({ ...fromDB, active: false });
			await this.db('institutes_types').where({ id }).update(convertDataValues(toUpdate));
			return { message: 'Institute type disabled successfull', data: toUpdate };
		} catch (err) {
			return err;
		}
	}
}
