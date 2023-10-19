import { INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';
import { Knex } from 'knex';

import { onError, onLog } from 'src/core/handlers';
import { UserLog } from 'src/repositories/entities';
import { PaginationModel, ReadUserlogOptionsModel, UserLogView } from 'src/repositories/models';

import { IUserLog } from 'src/repositories/types';
import { convertDataValues, existsOrError } from 'src/utils';

export class UserLogService {
	constructor(private conn: Knex) {}

	async create(data: IUserLog) {
		try {
			if (!data.tenancyId) {
				return onLog('User us not logged');
			}

			const log = new UserLog({ ...data, logDate: new Date() });
			const [id] = await this.conn('users_logs').insert(convertDataValues(log));

			existsOrError(Number(id), { message: 'Internal error', err: id });

			return onLog('Log successfully created', { ...log, id });
		} catch (err) {
			return onError('Error to save log', err);
		}
	}

	async read(options: ReadUserlogOptionsModel) {
		try {
			const { page, limit, tenancyId, userId } = options;

			const total = (await this.count(Number(tenancyId))) as number;
			const fromDB = userId
				? await this.conn({ ul: 'users_logs', u: 'users' })
						.select(
							{ id: 'ul.id', action: 'ul.action', in_table: 'ul.in_table', in_table_id: 'ul.in_table_id', log_date: 'ul.log_date' },
							{ user_id: 'u.id', first_name: 'u.first_name', last_name: 'u.last_name', user_email: 'u.email' }
						)
						.where('ul.tenancy_id', tenancyId)
						.andWhere('ul.user_id', userId)
						.andWhereRaw('u.id = ul.user_id')
						.offset(page * limit - limit)
						.orderBy('ul.log_date', 'desc')
				: await this.conn({ ul: 'users_logs', u: 'users' })
						.select(
							{ id: 'ul.id', action: 'ul.action', in_table: 'ul.in_table', in_table_id: 'ul.in_table_id', log_date: 'ul.log_date' },
							{ user_id: 'u.id', first_name: 'u.first_name', last_name: 'u.last_name', user_email: 'u.email' }
						)
						.where('ul.tenancy_id', tenancyId)
						.andWhereRaw('u.id = ul.user_id')
						.offset(page * limit - limit)
						.orderBy('ul.log_date', 'desc');

			existsOrError(fromDB, { message: 'Not Found', status: NOT_FOUND });
			existsOrError(Array.isArray(fromDB), { message: 'Internal Server Error', err: fromDB, status: INTERNAL_SERVER_ERROR });

			const data: any[] = [];
			const pagination = new PaginationModel({ page, limit, total });

			for (const item of fromDB) {
				data.push(new UserLogView({ ...convertDataValues(item, 'camel') }));
			}

			return { data, pagination };
		} catch (err) {
			return err;
		}
	}

	private async count(tenancyId: number) {
		return this.conn('users_logs')
			.count({ total: 'id' })
			.where('tenancy_id', tenancyId)
			.first()
			.then(res => Number(res?.total))
			.catch(err => {
				onError('erro to count log', err);
				return 0;
			});
	}
}
