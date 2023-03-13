import { INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';

import { Origin } from 'src/repositories/entities';
import { IServiceOptions } from 'src/repositories/types';
import { convertDataValues, existsOrError, ResponseException } from 'src/utils';
import { DatabaseService } from './abistract-database.service';

export class OriginService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: Origin) {
		return new ResponseException('method not implemented', data);
	}

	async update(data: Origin, id: number) {
		return new ResponseException('method not implemented', { ...data, id });
	}

	async read(id?: number) {
		if (id) return this.getOrigin(id);
		return this.db('origins').then(res => {
			existsOrError(Array.isArray(res), { message: 'Internal Error', error: res, status: INTERNAL_SERVER_ERROR });

			return res.map(i => convertDataValues(i, 'camel'));
		});
	}

	async getOrigin(id: number) {
		try {
			const fromDB = await this.db('origins').where({ id }).first();

			existsOrError(fromDB.id, { message: 'Not found', status: NOT_FOUND });
			return new Origin(convertDataValues(fromDB, 'camel'));
		} catch (err) {
			return err;
		}
	}
}
