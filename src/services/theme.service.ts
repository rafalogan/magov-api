import { FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';
import { onLog } from 'src/core/handlers';

import { Theme } from 'src/repositories/entities';
import { IServiceOptions } from 'src/repositories/types';
import { convertDataValues } from 'src/utils';
import { DatabaseService } from './abistract-database.service';

export class ThemeService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: Theme) {
		try {
			const fromDB = await this.read(data.name);

			if (fromDB.id) return { message: 'Theme already exists', status: FORBIDDEN };
			const [id] = await this.db('themes').insert(convertDataValues(data));

			return id
				? { message: 'Theme saved with success', data: { ...data, id } }
				: { message: 'internal server error', status: INTERNAL_SERVER_ERROR };
		} catch (err) {
			return err;
		}
	}

	async update(data: Theme, id: number) {
		try {
			const fromDB = await this.read(id);

			if (!fromDB?.id) return { message: 'Theme not found', status: NOT_FOUND };

			const toSave = new Theme({ ...fromDB, ...data });
			await this.db('themes').where({ id }).update(convertDataValues(toSave));

			return { message: 'Theme updated successfully', data: toSave };
		} catch (err) {
			return err;
		}
	}

	async read(filter?: string | number, active?: string) {
		onLog('filter', filter);
		onLog('active', active);
		if (filter) {
			return this.db('themes')
				.where({ id: filter })
				.orWhere({ name: filter })
				.first()
				.then(res => new Theme(convertDataValues(res, 'camel')))
				.catch(err => err);
		}

		if (active) {
			const value = active === 'true';
			return this.db('themes')
				.where({ active: value })
				.then(res => res?.map(t => new Theme(t)))
				.catch(err => err);
		}

		return this.db('themes')
			.then(res => res?.map(t => new Theme(t)))
			.catch(err => err);
	}

	async disable(id: number) {
		try {
			const fromDB = await this.read(id);

			if (!fromDB?.id) return { message: 'Theme not found', status: NOT_FOUND };

			const theme = new Theme(convertDataValues({ ...fromDB, active: false }, 'camel'));

			await this.db('themes').where({ id }).update(convertDataValues(theme));
			return { message: 'Theme is disabled', data: theme };
		} catch (err) {
			return err;
		}
	}
}
