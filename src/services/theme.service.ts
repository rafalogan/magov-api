import { FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';
import { onLog } from 'src/core/handlers';

import { Theme } from 'src/repositories/entities';
import { IServiceOptions } from 'src/repositories/types';
import { convertDataValues, existsOrError, notExistisOrError } from 'src/utils';
import { DatabaseService } from './abistract-database.service';

export class ThemeService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: Theme) {
		try {
			const fromDB = (await this.getTheme(data.name)) as any;
			notExistisOrError(fromDB?.id, { message: 'Theme already exists', status: FORBIDDEN });

			const [id] = await this.db('themes').insert(convertDataValues({ ...data, active: true }));
			existsOrError(Number(id), { message: 'internal server error', status: INTERNAL_SERVER_ERROR });

			return { message: 'Theme saved with success', data: { ...data, id } };
		} catch (err) {
			return err;
		}
	}

	async update(data: Theme, id: number) {
		try {
			const fromDB = (await this.getTheme(id)) as any;
			existsOrError(fromDB?.id, { message: 'Theme not found', status: NOT_FOUND });

			const toSave = new Theme({ ...fromDB, ...data });
			await this.db('themes').where({ id }).update(convertDataValues(toSave));

			return { message: 'Theme updated successfully', data: toSave };
		} catch (err) {
			return err;
		}
	}

	async read(filter?: string | number, active?: string) {
		try {
			onLog('filter', filter);
			onLog('active', active);
			if (filter) return this.getTheme(filter);

			const fromDB = active ? await this.db('themes').where({ active: true }) : await this.db('themes');
			existsOrError(Array.isArray(fromDB), { message: 'Internal error', err: fromDB, status: INTERNAL_SERVER_ERROR });

			return fromDB.map(item => new Theme(convertDataValues(item, 'camel')));
		} catch (err) {
			return err;
		}
	}

	async getTheme(filter: string | number) {
		try {
			const fromDB =
				typeof filter === 'number'
					? await this.db('themes').where('id', filter).first()
					: await this.db('themes').where('name', filter).first();
			existsOrError(fromDB, { message: 'theme not found', status: NOT_FOUND });
			notExistisOrError(fromDB?.severity === 'ERROR', { message: 'internal error', err: fromDB, status: INTERNAL_SERVER_ERROR });

			return new Theme(convertDataValues(fromDB, 'camel'));
		} catch (err) {
			return err;
		}
	}

	async disable(id: number) {
		try {
			const fromDB = (await this.getTheme(id)) as any;
			existsOrError(fromDB?.id, { message: 'Theme not found', status: NOT_FOUND });
			existsOrError(fromDB?.active, { message: 'Theme already desabled', status: FORBIDDEN });

			const theme = new Theme(convertDataValues({ ...fromDB, active: false }, 'camel'));

			await this.db('themes').where({ id }).update(convertDataValues(theme));
			return { message: 'Theme is disabled', data: theme };
		} catch (err) {
			return err;
		}
	}
}
