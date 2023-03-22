import { BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';
import { onLog } from 'src/core/handlers';
import { Task } from 'src/repositories/entities';
import {
	GovernmentExpensesModel,
	PlaintiffModel,
	ReadOptionsModel,
	TaskModel,
	TaskViewModel,
	UnitExpenseModel,
} from 'src/repositories/models';
import { IGovernmentExpensesModel, IServiceOptions, IUnitExpenseModel } from 'src/repositories/types';
import {
	clearDuplicateItems,
	convertBlobToString,
	convertDataValues,
	deleteField,
	existsOrError,
	isRequired,
	notExistisOrError,
} from 'src/utils';
import { DatabaseService } from './abistract-database.service';
import { PlaintiffService } from './plaintiff.service';
import { GovernmentExpensesService } from './government-expenses.service';
import { UnitExpenseService } from './unit-expense.service';

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
		{ user_id: 'u.id', user_first_name: 'u.first_name', user_last_name: 'u.last_name' },
		{ unit_id: 'un.id', unit: 'un.name' },
	];

	tablesToList = { t: 'tasks', u: 'users', un: 'units' };

	constructor(
		options: IServiceOptions,
		private plaintiffService: PlaintiffService,
		private governmentExpenseService: GovernmentExpensesService,
		private unitExpenseService: UnitExpenseService
	) {
		super(options);
	}

	async create(data: TaskModel) {
		try {
			const fromDB = (await this.getTask(data.title, data.tenancyId)) as TaskViewModel;

			onLog('response getTask', fromDB);

			notExistisOrError(fromDB?.id, { message: 'Task already existis', status: FORBIDDEN });
			const plaintiffId = await this.setPlaintiffId(data);
			onLog('plaintiffId', plaintiffId);
			const toSave = new Task({ ...data, plaintiffId });
			onLog('task to save', toSave);
			const [id] = await this.db('tasks').insert(convertDataValues(toSave));
			await this.setUsers(data.users, id);
			await this.setThemes(data.themes, id);

			const governmentExpense =
				data.cost && !data.unitExpense
					? await this.governmentExpenseService.create(
							new GovernmentExpensesModel({
								expense: data.title,
								tenancyId: data.tenancyId,
								dueDate: data.end,
								value: data.cost,
								task: { id, title: data.title },
							} as IGovernmentExpensesModel)
					  )
					: undefined;

			const unitExpense =
				data.cost && data.unitExpense
					? await this.unitExpenseService.create(
							new UnitExpenseModel({
								expense: data.title,
								tenancyId: data.tenancyId,
								dueDate: data.end,
								taskId: id,
								unitId: data.unitId,
								amount: 1,
								active: true,
								payments: [{ paymentForm: 'boleto', installments: 1, value: data.cost }],
							} as IUnitExpenseModel)
					  )
					: undefined;

			return {
				message: 'Task saved with success',
				data: { ...data, id, governmentExpense, unitExpense },
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
						.andWhereRaw('u.id = t.user_id')
						.andWhereRaw('un.id = t.unit_id')
				: await this.db(this.tablesToList)
						.select(...this.fieldsToList)
						.where('t.tenancy_id', tenancyId)
						.andWhereRaw('u.id = t.user_id')
						.andWhereRaw('un.id = t.unit_id');
			onLog('tasks from db: ', fromDB);

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

					existsOrError(proposition.title, { message: 'Internal error', error: proposition, status: INTERNAL_SERVER_ERROR });

					data.proposition = proposition.title;
				}

				data.themes = await this.getThemes(data.id);

				deleteField(data, 'userFirstName');
				deleteField(data, 'userLastName');

				res.push({ ...data, description: convertBlobToString(data.description) });
			}

			return res;
		} catch (err) {
			return err;
		}
	}

	async getTask(value: number | string, tenancyId: number) {
		try {
			const fields = [
				{
					id: 't.id',
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
				{ unit: 'u.name' },
			];
			const tables = { t: 'tasks', u: 'units' };

			const fromDB =
				typeof value === 'number'
					? await this.db(tables)
							.select(...fields)
							.where('t.id', value)
							.andWhere('t.tenancy_id', tenancyId)
							.andWhereRaw('u.id = t.unit_id')
							.first()
					: await this.db(tables)
							.select(...fields)
							.where('t.title', value)
							.andWhere('t.tenancy_id', tenancyId)
							.andWhereRaw('u.id = t.unit_id')
							.first();

			existsOrError(fromDB?.id, { message: 'Not found', status: NOT_FOUND });
			const raw = convertDataValues(fromDB, 'camel');
			onLog('raw to task', raw);

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
			const comments = (await this.getComments(raw.id, raw.tenancyId)) || [];

			onLog('comments', comments);

			const themes = await this.getThemes(raw.id);

			return new TaskViewModel({ ...raw, proposition, demand, plaintiff, comments, users, themes });
		} catch (err) {
			return err;
		}
	}

	async disabled(id: number, tenancyId: number) {
		try {
			const fromDB = await this.db('tasks').where({ id }).andWhere('tenancy_id', tenancyId).first();

			existsOrError(fromDB?.id, { message: 'Task Not found', status: NOT_FOUND });
			const raw = convertDataValues(fromDB, 'camel');
			await this.db('users_tasks').where({ task_id: raw.id }).del();
			await this.db('themes_tasks').where({ task_id: raw.id }).del();
			await this.db('tasks').where({ id }).andWhere('tenancy_id', tenancyId).del();

			if (fromDB.cost) await this.db('government_expenses').where({ task_id: id }).andWhere({ tenancy_id: tenancyId }).del();

			return { message: 'Task deleted with success', data: new Task(raw) };
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
			onLog('tehmes id', ids);

			for (const id of ids) {
				const data = await this.db('themes').select('id', ' name as theme').where({ id }).first();

				existsOrError(data.id, { message: 'Internal error', error: data, status: INTERNAL_SERVER_ERROR });
				res.push(convertDataValues(data, 'camel'));
			}

			return res;
		} catch (err) {
			return err;
		}
	}

	private async getComments(taskId: number, tenancyId: number) {
		return this.db({ c: 'comments', u: 'users' })
			.select(
				{ id: 'c.id', comment: 'c.comment', active: 'c.active' },
				{ user_id: 'u.id', user_first_name: 'u.first_name', user_last_name: 'u.last_name', user_email: 'u.email' }
			)
			.where('c.task_id', taskId)
			.andWhere('c.tenancy_id', tenancyId)
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
			onLog('users ids', ids);
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
			const fromDB = await this.plaintiffService.getPlaintiff(data.plaintiff?.cpfCnpj as string, data.tenancyId);

			onLog('plaintiff fom db to Task', fromDB);

			if (fromDB?.id) return fromDB.id;
			const dataSave = (await this.plaintiffService.create(data.plaintiff as PlaintiffModel)) as any;
			onLog('plaintiff to save', dataSave);
			return Number(dataSave.data.id);
		} catch (err) {
			return err;
		}
	}

	private async setThemes(themes: string[], taskId: number) {
		try {
			onLog('themes to set', themes);
			onLog('task to set theme', taskId);

			await this.db('themes_tasks').where('task_id', taskId).del();
			for (const theme of themes) {
				onLog('theme in for', theme);
				const fromDB = await this.db('themes').where({ name: theme }).select('id as themeId').first();
				onLog('search theme', fromDB);

				if (fromDB?.themeId) {
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
