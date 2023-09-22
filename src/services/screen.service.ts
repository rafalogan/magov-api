import { FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';

import { IServiceOptions } from 'src/repositories/types';
import { DatabaseService } from './abistract-database.service';
import { AppScreen } from 'src/repositories/entities';
import { convertDataValues, existsOrError, notExistisOrError } from 'src/utils';

export class ScreenService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: AppScreen) {
		try {
			const fromDB = await this.findOne(data.name) as AppScreen;

			notExistisOrError(fromDB?.id, { message: 'screen already exists', status: FORBIDDEN });
			const [id] = await this.db('app_screen').insert(convertDataValues(data));

			existsOrError(Number(id), { message: 'Internal Error', err: id, status: INTERNAL_SERVER_ERROR })
			return { message: 'Screen successfully inserted', data: { ...data, id } }
		} catch (err) {
			return err;
		}
	}

	async update(data: AppScreen, id: number | string) {
		try {
			const fromDB = await this.findOne(id) as AppScreen

			existsOrError(fromDB?.id, fromDB);
			const toUpdate = new AppScreen({ ...fromDB, ...data });

			await this.db('app_screen').update(convertDataValues(toUpdate)).where({ id })
			return { messge: 'Screen successfully update', data: toUpdate }
		} catch (err) {
			return err;
		}
	}

	async read(id?: number) {
		try {
			if (id) return this.findOne(id);

			const fromDB = await this.db('app_screen').select('id', 'name').orderBy('id', 'desc');
			existsOrError(Array.isArray(fromDB), { messge: 'Internal Error', err: fromDB, status: INTERNAL_SERVER_ERROR })

			return fromDB.map(i => convertDataValues(i, 'camel'))

		} catch (err) {
			return err
		}
	}

	async findOne(filter: number | string) {
		try {
			const fromDB = await this.db('app_screen').where(typeof filter === 'number' ? { id: filter } : { name: filter }).first();

			existsOrError(fromDB, { message: 'Screen not found', status: NOT_FOUND });
			notExistisOrError(fromDB?.severity === 'ERROR', { message: 'Internal Error', err: fromDB, status: INTERNAL_SERVER_ERROR })

			return new AppScreen(convertDataValues(fromDB, 'camel'))
		} catch (err) {
			return err
		}
	}

	async delete(id: number) {
		try {
			const fromDB = await this.findOne(id) as AppScreen;

			existsOrError(fromDB?.id, { message: 'Screen already deleted', status: FORBIDDEN });

			await this.db('app_screen').where({ id }).del();

			return { message: 'Screen successfully deleted', data: fromDB }
		} catch (err) {
			return err
		}
	}
}
