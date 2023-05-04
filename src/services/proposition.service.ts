import { BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';
import { onLog } from 'src/core/handlers';
import { FileEntity, Proposition, Task } from 'src/repositories/entities';
import { GovernmentExpensesModel, PropositionModel, PropositionsReadOptionsModel, PropositionViewModel } from 'src/repositories/models';
import { IGovernmentExpensesModel, IProposition, IServiceOptions } from 'src/repositories/types';
import { convertBlobToString, convertDataValues, existsOrError, isRequired, notExistisOrError, setValueNumberToView } from 'src/utils';
import { DatabaseService } from './abistract-database.service';
import { GovernmentExpensesService } from './government-expenses.service';

export class PropositionService extends DatabaseService {
	constructor(options: IServiceOptions, private governmentExpenseService: GovernmentExpensesService) {
		super(options);
	}

	async create(data: PropositionModel) {
		try {
			const fromDB = (await this.getProprosition(data.title, data.tenancyId)) as PropositionViewModel;

			notExistisOrError(fromDB.id, { messsage: 'Proposition alredy existis', status: FORBIDDEN });
			const toSave = new Proposition({ ...data, active: true } as IProposition);
			const [id] = await this.db('propositions').insert(convertDataValues(toSave));

			existsOrError(Number(id), { message: 'Internal error', error: id, status: INTERNAL_SERVER_ERROR });
			if (data.budgets?.length) await this.setBudgets(data.budgets, id);
			if (data.keywords.length !== 0) await this.setKeywords(data.keywords, id);
			if (data.themes.length !== 0) await this.setThemes(data.themes, id);
			if (data.demands?.length !== 0) await this.setDemands(data.demands as number[], id);
			const governmentExpense = data.expense
				? await this.governmentExpenseService.create(
						new GovernmentExpensesModel({
							expense: data.title,
							description: data.menu,
							dueDate: data.deadline,
							value: data.expense,
							proposition: { id, title: data.title },
							budgets: data.budgets?.map(i => ({ id: Number(i) })),
							tenancyId: data.tenancyId,
						} as IGovernmentExpensesModel)
				  )
				: undefined;
			await this.setTasks(data.tasks, id);
			const file = data?.file ? await this.setFile(data.file, 'propositionId', id) : undefined;

			return { message: 'Proposition saved with success', data: { ...data, id, governmentExpense, file } };
		} catch (err) {
			return err;
		}
	}

	async update(data: PropositionModel, id: number) {
		try {
			const fromDB = (await this.getProprosition(id, data.tenancyId)) as PropositionViewModel;

			existsOrError(fromDB.id, { message: 'Not found', status: NOT_FOUND });
			const active = data.active !== null && data.active !== undefined ? data.active : fromDB.active;
			const toUpdate = new Proposition({ ...fromDB, ...data, tenancyId: fromDB.tenancyId, active });
			await this.db('propositions').where({ id }).andWhere({ tenancy_id: fromDB.tenancyId }).update(convertDataValues(toUpdate));

			if (data?.budgets?.length) {
				await this.db('budget_proposals').where({ proposition_id: id }).del();
				await this.setBudgets(data.budgets, id);
			}

			if (data?.keywords?.length) {
				await this.db('propositions_keywords').where({ proposition_id: id }).del();
				await this.setKeywords(data.keywords, id);
			}

			if (data?.themes?.length) {
				await this.db('propositions_keywords').where({ proposition_id: id }).del();
				await this.setThemes(data.themes, id);
			}

			if (data?.demands?.length) {
				await this.db('propositions_demands').where({ proposition_id: id }).del();
				await this.setDemands(data.demands, id);
			}

			if (data?.tasks?.length) await this.setTasks(data.tasks, id);
			if (data?.file) await this.setFile(data.file, 'propositionId', id);

			return { message: 'Proposition updated with success', data: { ...toUpdate, ...data } };
		} catch (err) {
			return err;
		}
	}

	async read(options: PropositionsReadOptionsModel, id?: number) {
		try {
			const { tenancyId, unitId } = options;

			existsOrError(tenancyId, { message: isRequired('tenancyId'), status: BAD_REQUEST });
			if (id) return this.getProprosition(id, tenancyId as number);

			const table = 'propositions';
			const fields = ['id', 'title', 'favorite', 'deadline', 'active', 'menu', 'expense'];

			const fromDB = unitId
				? await this.db(table)
						.select(...fields)
						.where({ unit_id: unitId })
						.andWhere({ tenancy_id: tenancyId })
				: await this.db(table)
						.select(...fields)
						.where({ tenancy_id: tenancyId });

			existsOrError(Array.isArray(fromDB), { message: 'Internal error', status: INTERNAL_SERVER_ERROR, err: fromDB });
			const raw = fromDB.map((i: any) => convertDataValues(i, 'camel'));

			const res: any[] = [];

			for (const item of raw) {
				const themesRaw = (await this.getValues({
					value: item.id,
					tableIds: 'propositions_themes',
					fieldIds: 'theme_id',
					whereIds: 'proposition_id',
					table: 'themes',
					fields: ['id', 'name'],
				})) as any;
				const keywordsRaw = (await this.getValues({
					value: item.id,
					tableIds: 'propositions_keywords',
					fieldIds: 'keyword_id',
					whereIds: 'proposition_id',
					table: 'keywords',
					fields: ['id', 'keyword'],
				})) as any;

				const favorite = !!item.favorite;
				const active = !!item.active;
				const themes = themesRaw.map((i: any) => i.name).join('/');
				const keywords = keywordsRaw.map((i: any) => i.keyword).join(', ');
				const expense = setValueNumberToView(item.expense);
				const menu = convertBlobToString(item.menu);

				res.push({ ...item, favorite, active, expense, themes, keywords, menu });
			}

			return res;
		} catch (err) {
			return err;
		}
	}

	async getProprosition(value: number | string, tenancyId: number) {
		try {
			const fromDB = await this.db('propositions').where('id', value).andWhere('tenancy_id', tenancyId).orWhere('title', value).first();

			existsOrError(fromDB, { message: 'Not Found', status: NOT_FOUND });
			existsOrError(fromDB.id, { message: 'Internal error', error: fromDB, status: INTERNAL_SERVER_ERROR });

			const demands = await this.getValues({
				value: fromDB.id,
				tableIds: 'propositions_demands',
				fieldIds: 'demand_id',
				whereIds: 'proposition_id',
				table: 'demands',
				fields: ['id', 'name'],
			});

			const budgets = await this.getValues({
				value: fromDB.id,
				tableIds: 'budget_proposals',
				fieldIds: 'revenue_id',
				whereIds: 'proposition_id',
				table: 'revenues',
				fields: ['id', 'revenue', 'value'],
			});

			const keywords = await this.getValues({
				value: fromDB.id,
				tableIds: 'propositions_keywords',
				fieldIds: 'keyword_id',
				whereIds: 'proposition_id',
				table: 'keywords',
				fields: ['id', 'keyword'],
			});

			const themes = await this.getValues({
				value: fromDB.id,
				tableIds: 'propositions_themes',
				fieldIds: 'theme_id',
				whereIds: 'proposition_id',
				table: 'themes',
				fields: ['id', 'name'],
			});

			const tasks = await this.getTasksProposition(fromDB.id);
			const file = await this.getFile(fromDB.id);

			return new PropositionViewModel(convertDataValues({ ...fromDB, budgets, demands, keywords, themes, tasks, file }, 'camel'));
		} catch (err) {
			return err;
		}
	}

	async disabled(id: number, tenancyId: number) {
		try {
			const fromDB = (await this.getProprosition(id, tenancyId)) as PropositionViewModel;
			existsOrError(fromDB.id, { message: 'Not found', status: NOT_FOUND });

			const toDesabled = new Proposition({ ...fromDB, active: false });
			await this.db('propositions').where({ id }).andWhere({ tenancy_id: tenancyId }).update(convertDataValues(toDesabled));
			if (fromDB.expense) {
				await this.db('government_expenses').where('proposition_id', id).andWhere('tenancy_id', fromDB.tenancyId).update({ active: false });
			}

			return { message: 'Proposition disabled with success', data: { ...fromDB, ...toDesabled } };
		} catch (err) {
			return err;
		}
	}

	async favorite(id: number) {
		return super
			.favoriteItem('propositions', id)
			.then(res => res)
			.catch(err => err);
	}

	async addUrl(propositionUrl: string, id: number, tenancyId: number) {
		try {
			const fromDB = (await this.getProprosition(id, tenancyId)) as any;

			existsOrError(fromDB?.id, fromDB);
			const toUpdate = new Proposition({ ...fromDB, propositionUrl, tenancyId }, id);

			await this.db('propositions').where({ id }).andWhere('tenancy_id', tenancyId).update(convertDataValues(toUpdate));

			return { message: `Url: ${propositionUrl}, sucessfully added`, data: { ...fromDB, propositionUrl } };
		} catch (err) {
			return err;
		}
	}

	private async setDemands(values: number[], propositionId: number) {
		try {
			for (const demandId of values) {
				await this.db('propositions_demands').insert(convertDataValues({ demandId, propositionId }));
			}
		} catch (err) {
			return err;
		}
	}

	private async setTasks(tasks: Task[], propositionId: number) {
		try {
			for (const task of tasks) {
				onLog('task to save', task);
				await this.setPropositionTask(task, propositionId);
			}
		} catch (err) {
			return err;
		}
	}

	private async setBudgets(budgets: number[], propositionId: number) {
		try {
			for (const revenueId of budgets) {
				onLog('revenue', revenueId);
				await this.db('budget_proposals').insert(convertDataValues({ revenueId, propositionId }));
			}
		} catch (err) {
			return err;
		}
	}

	private async setPropositionTask(data: Task, propositionId: number) {
		try {
			const fromDB = await this.db('tasks').where({ title: data.title }).andWhere({ tenancy_id: data.tenancyId }).first();

			onLog('task from db', fromDB);

			if (fromDB?.id) {
				await this.db('tasks')
					.where({ id: fromDB.id })
					.andWhere({ tenancy_id: data.tenancyId })
					.update(
						convertDataValues({
							...convertDataValues(fromDB),
							...data,
							propositionId,
							tenancyId: fromDB.tenancy_id,
						})
					);
				return;
			}

			const [id] = await this.db('tasks').insert(convertDataValues({ ...data, propositionId }));
			onLog('save task', id);
			existsOrError(Number(id), { message: 'Internal error', error: id, status: INTERNAL_SERVER_ERROR });
		} catch (err) {
			return err;
		}
	}

	private async setKeywords(keywords: string[], id: number) {
		try {
			for (const keyword of keywords) {
				const fromDB = await this.db('keywords').where({ keyword }).first();
				onLog('keyword', keyword);
				onLog('keyword fromDB', fromDB);

				if (!fromDB?.id) {
					const [keywordId] = await this.db('keywords').insert(convertDataValues({ keyword }));
					await this.db('propositions_keywords').insert(convertDataValues({ keywordId, propositionId: id }));
				} else {
					await this.db('propositions_keywords').insert(convertDataValues({ keywordId: fromDB.id, propositionId: id }));
				}
			}
		} catch (err) {
			return err;
		}
	}

	private async setThemes(themes: string[], propositionId: number) {
		try {
			for (const theme of themes) {
				const fromDB = await this.db('themes').where({ name: theme }).first();

				if (!fromDB?.id) {
					const [themeId] = await this.db('themes').insert(convertDataValues({ name: theme }));
					await this.db('propositions_themes').insert(convertDataValues({ themeId, propositionId }));
				} else {
					await this.db('propositions_themes').insert(convertDataValues({ themeId: fromDB.id, propositionId }));
				}
			}
		} catch (err) {
			return err;
		}
	}

	private async getTasksProposition(id: number) {
		try {
			const fromDB = await this.db({ t: 'tasks', u: 'users' })
				.select(
					{
						id: 't.id',
						task: 't.title',
						deadline: 't.end',
						level: 't.level',
					},
					{ user_id: 'u.id', user_first_name: 'u.first_name', user_last_name: 'u.last_name' }
				)
				.where('t.proposition_id', id)
				.andWhereRaw('u.id = t.user_id');
			if (!Array.isArray(fromDB)) return [];

			return fromDB.map(i => {
				i = convertDataValues(i, 'camel');
				return { ...i, responsible: `${i.userFirstName} ${i.userLastName}` };
			});
		} catch (err) {
			return err;
		}
	}

	private async getFile(propositionId: number) {
		try {
			const fromDB = await this.db('files').where('proposition_id', propositionId).first();
			notExistisOrError(fromDB?.severity === 'ERROR', { message: 'Internal Error', err: fromDB, status: INTERNAL_SERVER_ERROR });

			return fromDB?.id ? new FileEntity(convertDataValues(fromDB, 'camel')) : fromDB;
		} catch (err) {
			return err;
		}
	}
}
