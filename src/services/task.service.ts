import { BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';
import { Task } from 'src/repositories/entities';
import { PlaintiffModel, ReadOptionsModel, TaskModel, TaskViewModel } from 'src/repositories/models';
import { IServiceOptions } from 'src/repositories/types';
import { clearDuplicateItems, convertDataValues, deleteField, existsOrError, isRequired, notExistisOrError } from 'src/utils';
import { DatabaseService } from './abistract-database.service';
import { PlaintiffService } from './plaintiff.service';

export class TaskService extends DatabaseService {
	fieldsToList = [
		{
			id: 't.id',
			title: 't.title',
			description: 't.description',
			cost: 't.cost',
			start: 't.start',
			end: 't.end',
			level: 't.level',
			status: 't.status',
			tenancy_id: 't.tenancy_id',
			proposition_id: 't.proposition_id',
			demand_id: 't.demand_id',
			plaintiff_id: 't.plaintiff_id',
		},
		{ user_id: 'u.id', user_frist_name: 'u.frist_name', user_last_name: 'u.last_name' },
		{ unit_id: 'un.id', unit: 'un.name' },
	];

	tablesToList = { t: 'tasks', u: 'users', un: 'units' };

	constructor(options: IServiceOptions, private plaintiffService: PlaintiffService) {
		super(options);
	}

	async create(data: TaskModel) {
		try {
			const fromDB = (await this.getTask(data.title, data.tenancyId)) as TaskViewModel;

			notExistisOrError(fromDB, { message: 'Internal error', error: fromDB, status: INTERNAL_SERVER_ERROR });
			notExistisOrError(fromDB.id, { message: 'Task already existis', status: FORBIDDEN });
			const plaintiffId = await this.setPlaintiffId(data);
			const toSave = new Task({ ...data, plaintiffId });
			const [id] = await this.db('tasks').insert(convertDataValues(toSave));
			await this.setUsers(data.users, id);
			await this.setThemes(data.themes, id);

			return {
				message: 'Task saved with success',
				data: { ...data, id },
			};
		} catch (err) {
			return err;
		}
	}

	async update(data: TaskModel, id: number) {
		try {
			const fromDB = (await this.getTask(id, data.tenancyId)) as TaskViewModel;

			existsOrError(fromDB.id, fromDB);
			const plaintiffId = await this.setPlaintiffId(data);
			const toUpdate = new Task({ ...fromDB, ...data, tenancyId: fromDB.tenancyId, plaintiffId });

			await this.db('tasks').where({ id }).andWhere('tenancy_id', toUpdate.tenancyId).update(convertDataValues(toUpdate));
			await this.setUsers(data.users, id);
			await this.setThemes(data.themes, id);

			return { message: 'Task Updated with success', data: { ...toUpdate } };
		} catch (err) {
			return err;
		}
	}

	async read(options: ReadOptionsModel, id?: number) {
		const { tenancyId, unitId } = options;

		try {
			existsOrError(tenancyId, { message: isRequired('tenancyId'), status: BAD_REQUEST });
		} catch (err) {
			return err;
		}

		if (id) return this.getTask(id, Number(tenancyId));

		return this.getTasks(Number(tenancyId), unitId);
	}

	async getTasks(tenancyId: number, unitId?: number) {
		try {
			const res: any = [];
			const fromDB = unitId
				? await this.db(this.tablesToList)
						.select(...this.fieldsToList)
						.where('t.tenancy_id', tenancyId)
						.andWhere('t.unit_id', unitId)
				: await this.db(this.tablesToList)
						.select(...this.fieldsToList)
						.where('t.tenancy_id', tenancyId);

			existsOrError(Array.isArray(fromDB), { message: 'Internal error', error: fromDB, status: INTERNAL_SERVER_ERROR });

			for (const raw of fromDB) {
				const data = convertDataValues(raw, 'camel');
				data.responsible = `${data.userFirstName} ${data.userLastName}`;
				data.users = await this.getUsers(data.id, data.userId);

				if (data.plaintiffId) {
					const plaintiff = (await this.plaintiffService.getPlaintiff(data.plaintiffId, data.tenancyId)) as PlaintiffModel;

					existsOrError(plaintiff.id, plaintiff);
					data.plaintiff = plaintiff.name;
				}

				if (data.demandId) {
					const demand = await this.db('demands').where('id', data.demandId).select('name').first();
					existsOrError(demand.name, { message: 'Internal error', error: demand, status: INTERNAL_SERVER_ERROR });

					data.demand = demand.name;
				}

				if (data.propositionId) {
					const proposition = await this.db('propositions').select('title').where('id', data.propositionId).first();

					existsOrError(proposition.name, { message: 'Internal error', error: proposition, status: INTERNAL_SERVER_ERROR });

					data.proposition = proposition.name;
				}

				data.themes = await this.getThemes(data.id);

				deleteField(data, 'userFirstName');
				deleteField(data, 'userLastName');

				res.forEach(data);
			}

			return res;
		} catch (err) {
			return err;
		}
	}

	async getTask(value: number | string, tenancyId: number) {
		try {
			const fromDB = await this.db({ t: 'tasks', u: 'units' })
				.select(
					{
						title: 't.title',
						description: 't.description',
						cost: 't.cost',
						start: 't.start',
						end: 't.end',
						level: 't.level',
						status: 't.status',
						user_id: 't.user_id',
						unit_id: 't.unit_id',
						tenancy_id: 't.tenancy_id',
						proposition_id: 't.proposition_id',
						demand_id: 't.demand_id',
						plaintiff_id: 't.plaintiff_id',
					},
					{ unit: 'u.name' }
				)
				.where('t.id', value)
				.andWhere('t.tenancy_id', tenancyId)
				.andWhereRaw('u.id = t.unit_id')
				.orWhere('t.title', value)
				.first();

			existsOrError(fromDB?.id, { message: 'Not found', status: NOT_FOUND });
			const raw = convertDataValues(fromDB, 'camel');

			const users = await this.getUsers(raw.id, raw.userId);
			const proposition = raw.propositionId
				? await this.db('propositions').select('id', 'title', 'deadline').where({ id: raw.propositionId }).first()
				: undefined;
			const demand = raw.demandId
				? await this.db('demands').select('id', 'name', 'dead_line as deadline').where({ id: raw.demandId }).first()
				: undefined;

			const plaintiff = raw.plaintiffId
				? await this.db('plaintiffs').select('id', 'name').where({ id: raw.plaintiffId }).first()
				: undefined;

			const comments = (await this.getComments(raw.id)) || [];

			const themes = await this.getThemes(raw.id);

			return new TaskViewModel({ ...raw, proposition, demand, plaintiff, comments, users, themes });
		} catch (err) {
			return err;
		}
	}

	async disabled(id: number, tenancyId: number) {
		try {
			const fromDB = await this.db('tasks').where({ id }).andWhere('tenancy_id', tenancyId).first();

			existsOrError(fromDB.id, fromDB);
			const raw = convertDataValues(fromDB, 'camel');
			const toDisable = new Task({ ...raw, active: false }, Number(fromDB.id));
			await this.db('tasks').where({ id }).andWhere('tenancy_id', tenancyId).update(convertDataValues(toDisable));

			return { message: 'Task disabled with success', data: toDisable };
		} catch (err) {
			return err;
		}
	}

	private async getThemes(taskId: number) {
		try {
			const res: any = [];
			const themesIds = await this.db('themes_tasks').select('theme_id').where('task_id', taskId);

			existsOrError(Array.isArray(themesIds), { message: 'Internal error', error: themesIds, status: INTERNAL_SERVER_ERROR });
			const ids = themesIds.map(i => i['theme_id']);

			for (const id of ids) {
				const data = await this.db('themes').select('id', 'theme').where({ id }).first();

				existsOrError(data.id, { message: 'Internal error', error: data, status: INTERNAL_SERVER_ERROR });
				res.push(convertDataValues(data, 'camel'));
			}
		} catch (err) {
			return err;
		}
	}

	private async getComments(taskId: number) {
		return this.db('comments')
			.select('id', 'comment', 'user', 'active')
			.where('task_id', taskId)
			.then(res => {
				existsOrError(Array.isArray(res), { message: 'Internal Error', error: res, status: INTERNAL_SERVER_ERROR });
				return res.map(i => convertDataValues(i, 'camel'));
			})
			.catch(err => err);
	}

	private async getUsers(taskId: number, userId: number) {
		try {
			const usersIds = await this.db('users_tasks').select('user_id').where({ task_id: taskId });
			const ids = clearDuplicateItems([userId, ...usersIds.map(i => i['user_id'])]);
			const res = [];

			for (const id of ids) {
				const user = await this.db('users').where({ id }).select('id', 'first_name', 'last_name').first();

				res.push({
					id: user.id,
					name: `${user.first_name} ${user.last_name}`,
				});
			}

			return res;
		} catch (err) {
			return err;
		}
	}

	private async setUsers(usersIds: number[], taskId: number) {
		try {
			const ids = clearDuplicateItems(usersIds);
			await this.db('users_tasks').where({ task_id: taskId }).del();

			for (const userId of ids) {
				await this.db('users_tasks').insert(convertDataValues({ userId, taskId }));
			}
		} catch (err) {
			return err;
		}
	}

	private async setPlaintiffId(data: TaskModel) {
		try {
			if (data?.plaintiffId || data?.plaintiff?.id) return data.plaintiff?.id || data.plaintiffId;
			const fromDB = await this.plaintiffService.getPlaintiff(data.plaintiff?.name as string, data.tenancyId);

			if (fromDB.id) return fromDB.id;
			const dataSave = (await this.plaintiffService.create(data.plaintiff as PlaintiffModel)) as any;

			return Number(dataSave.data.id);
		} catch (err) {
			return err;
		}
	}

	private async setThemes(themes: string[], taskId: number) {
		try {
			await this.db('themes_tasks').where('task_id', taskId).del();
			for (const theme of themes) {
				const fromDB = await this.db('themes').where({ name: theme }).select('theme_id as themeId').first();

				if (fromDB.themeId) {
					const { themeId } = fromDB;
					await this.db('themes_tasks').insert(convertDataValues({ themeId, taskId }));
				} else {
					const [themeId] = await this.db('themes').insert(convertDataValues({ name: theme, active: true }));
					await this.db('themes_tasks').insert(convertDataValues({ themeId, taskId }));
				}
			}
		} catch (err) {
			return err;
		}
	}
}
