import { Request } from 'express';
import { FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';

import { IReadOptions, IServiceOptions } from 'src/repositories/types';
import { DatabaseService } from './abistract-database.service';
import { MessageHistory, MessageTrigger, SetMessageTrigger } from 'src/repositories/entities';
import { convertDataValues, existsOrError } from 'src/utils';
import { getUserLogData, onLog } from 'src/core/handlers';
import dayjs from 'dayjs';

export class MessageTriggerService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: MessageTrigger, req: Request) {
		try {
			const fromDB = (await this.findOne(data.tenancyId)) as MessageTrigger;

			if (fromDB?.id) {
				return this.update(fromDB, fromDB.id, req);
			}

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

	async update(data: MessageTrigger, tenancyId: number, req: Request) {
		try {
			const fromDB = (await this.findOne(tenancyId)) as MessageTrigger;

			existsOrError(fromDB?.id, fromDB);

			const triggers = data.triggers + fromDB.triggers;
			const dueDate = new Date();

			const toUpdate = new MessageTrigger({ ...fromDB, ...data, triggers, dueDate });

			await this.db('message_triggers').update(convertDataValues(toUpdate)).where('tenancy_id', fromDB.tenancyId);
			await this.userLogService.create(getUserLogData(req, 'trriger', tenancyId, 'Atualizar'));

			return { message: 'Tregger Update Successful', data: toUpdate };
		} catch (err: any) {
			return err;
		}
	}

	async triggerMessage(data: SetMessageTrigger) {
		try {
			const { tenancyId, contacts, message } = data;
			const triggersSolicited = contacts.length;
			const fromDB = (await this.findOne(tenancyId)) as MessageTrigger;

			existsOrError(fromDB?.id, fromDB);
			existsOrError(fromDB?.triggers >= triggersSolicited, { message: 'creditos insuficientes para enviar messagem', status: FORBIDDEN });

			const triggers = fromDB?.triggers - triggersSolicited;

			onLog('message to send', message);
			await this.db('message_triggers').update(convertDataValues({ triggers })).where('tenancy_id', tenancyId);

			const dataHistory = new MessageHistory({ message, tenancyId, sendDate: new Date() });

			const history = await this.createHistory(dataHistory);

			return {
				message: 'messagem pode ser enviada',
				tenancyCerdits: { ...fromDB, triggers },
				oldCredits: fromDB.triggers,
				history,
			};
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

	async findHistory(tenancyId: number) {
		try {
			await this.deletedHistories(tenancyId);
			const fromDB = await this.db('history_messages').where('tenancy_id', tenancyId);

			existsOrError(Array.isArray(fromDB), { message: 'Internal error', err: fromDB, status: INTERNAL_SERVER_ERROR });

			return fromDB.map(i => new MessageHistory(convertDataValues(i, 'camel')));
		} catch (err: any) {
			return err;
		}
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

	async deletedHistories(tenancyId: number) {
		const today = dayjs(new Date()).endOf('day').toDate();
		onLog('data limite', today);

		return this.db('history_messages')
			.where('tenancy_id', tenancyId)
			.whereRaw('tenancy_id <= ?', today)
			.del()
			.then(res => ({ message: 'histories clears', rows: res }))
			.catch(err => ({ message: 'Internal error', err, status: INTERNAL_SERVER_ERROR }));
	}
}
