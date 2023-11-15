import { Request } from 'express';
import { FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';

import { IReadOptions, IServiceOptions } from 'src/repositories/types';
import { DatabaseService } from './abistract-database.service';
import { MessageHistory, MessageTrigger } from 'src/repositories/entities';
import { convertDataValues, existsOrError, notExistisOrError } from 'src/utils';
import { getUserLogData } from 'src/core/handlers';

export class MessageTriggerService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: MessageTrigger, req: Request) {
		try {
			const fromDB = (await this.findOne(data.tenancyId)) as MessageTrigger;

			notExistisOrError(fromDB?.id, { message: 'Triger already exists', status: FORBIDDEN });

			const [id] = await this.db('message_triggers').insert(convertDataValues(data));
			existsOrError(Number(id), { message: 'Internal error', err: id, status: INTERNAL_SERVER_ERROR });

			await this.userLogService.create(getUserLogData(req, 'trriger', id, 'salvar'));

			return { message: 'trigger successiful saved', data: { ...data, id } };
		} catch (err) {
			return err;
		}
	}

	async createHistory(data: MessageHistory) {
		try {
			const [id] = await this.db('history_messages').insert(convertDataValues(data));

			existsOrError(Number(id), { message: 'Internal error', err: id, status: INTERNAL_SERVER_ERROR });

			return { messge: 'Message History saved successiful', data: { ...data, id } };
		} catch (err: any) {
			return err;
		}
	}

	async update(data: MessageTrigger, id: number, req: Request) {
		try {
			const fromDB = (await this.findOne(id)) as MessageTrigger;

			existsOrError(fromDB?.id, fromDB);

			const toUpdate = { ...fromDB, ...data };

			await this.db('message_triggers').update(convertDataValues(toUpdate)).where('tenancy_id', fromDB.tenancyId);
			await this.userLogService.create(getUserLogData(req, 'trriger', id, 'Atualizar'));

			return { message: 'Tregger Update Successful', data: toUpdate };
		} catch (err: any) {
			return err;
		}
	}

	async findOne(tenancyId: number) {
		try {
			const fromDB = await this.db('message_triggers').where('tenancy_id', tenancyId).first();

			existsOrError(fromDB, { message: 'Not found', status: NOT_FOUND });
			existsOrError(fromDB?.id, { message: 'Internal error', status: INTERNAL_SERVER_ERROR, err: fromDB });

			return new MessageTrigger(convertDataValues(fromDB, 'camel'));
		} catch (err) {
			return err;
		}
	}

	async find() {
		const fromDB = await this.db('message_triggers');

		existsOrError(Array.isArray(fromDB), { message: 'Internal error', err: fromDB, status: INTERNAL_SERVER_ERROR });

		return fromDB.map(i => new MessageTrigger(convertDataValues(i, 'camel')));
	}

	async read(options: IReadOptions) {
		const { tenancyId } = options;

		if (tenancyId) return this.findOne(tenancyId);

		return this.find();
	}

	async delete(tenancyId: number) {
		try {
			const fromDB = (await this.findOne(tenancyId)) as MessageTrigger;

			existsOrError(fromDB?.id, { message: 'Triggers not found or already deleted', status: FORBIDDEN });

			await this.db('message_triggers').where('tenancy_id', tenancyId).del();

			return { message: 'Tregger deleted successiful', data: fromDB };
		} catch (err: any) {
			return err;
		}
	}


	async deletedHistories() { try { } catch (err: any) { return err } }
}
