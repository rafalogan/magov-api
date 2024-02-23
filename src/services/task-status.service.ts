import { Request } from 'express';

import { DatabaseService } from './abistract-database.service';
import { IServiceOptions } from 'src/repositories/types';
import { TaskStatus } from 'src/repositories/entities';
import { getUserLogData, onError } from 'src/core/handlers';
import { convertDataValues, existsOrError, notExistisOrError } from 'src/utils';
import { INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';

export class TaskStatusService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: TaskStatus, req: Request) {
		try {
			const fromDB = await this.findOne(data.status);

			notExistisOrError(fromDB?.id, { message: 'status already exists', status: NOT_FOUND });

			const status = new TaskStatus(data);

			const [id] = await this.db('tasks_status').insert(status);
			await this.userLogService.create(getUserLogData(req, 'status tarefa', id, 'salvar'));

			return { message: 'status created with success', data: { ...status, id } };
		} catch (err: any) {
			onError('status error', err);
			return err;
		}
	}

	async update(data: TaskStatus, id: number, req: Request) {
		try {
			const fromDB = await this.findOne(id);

			existsOrError(fromDB?.id, { message: 'status not found', status: NOT_FOUND });

			const status = new TaskStatus({ ...fromDB, ...data });

			await this.db('tasks_status').where({ id }).update(status);
			await this.userLogService.create(getUserLogData(req, 'status tarefa', id, 'editar'));

			return { message: 'status updated with success', data: { ...status, id } };
		} catch (err: any) {
			onError('status error', err);
			return err;
		}
	}

	async read(id?: number) {
		try {
			if (id) return this.findOne(id);
			return this.find();
		} catch (err: any) {
			onError('status error', err);
			return err;
		}
	}

	async find() {
		try {
			const fromDB = await this.db('tasks_status');

			return fromDB.map(status => new TaskStatus(convertDataValues(status, 'camel')));
		} catch (err: any) {
			onError('status error', err);
			return err;
		}
	}

	async findOne(filter: string | number) {
		try {
			const fromDB = Number(filter)
				? await this.db('tasks_status').where({ id: filter }).first()
				: await this.db('tasks_status').where({ status: filter }).first();

			existsOrError(fromDB, { message: 'status not found', status: NOT_FOUND });
			notExistisOrError(fromDB?.severity, { message: 'Internal error', status: INTERNAL_SERVER_ERROR });

			return new TaskStatus(convertDataValues(fromDB, 'camel'));
		} catch (err: any) {
			onError('status error', err);
			return err;
		}
	}

	async delete(id: number, req: Request) {
		try {
			const fromDB = await this.findOne(id);

			existsOrError(fromDB?.id, { message: 'status not found', status: NOT_FOUND });

			await this.db('tasks_status').where({ id }).del();
			await this.userLogService.create(getUserLogData(req, 'stauts tarefa', id, 'deletar'));

			return { message: 'status deleted with success' };
		} catch (err: any) {
			onError('status error', err);
			return err;
		}
	}
}
