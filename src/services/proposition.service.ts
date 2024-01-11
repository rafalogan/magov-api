import { Request } from 'express';
import { BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';

import { getUserLogData, onLog } from 'src/core/handlers';
import { FileEntity, Proposition, Task } from 'src/repositories/entities';
import { GovernmentExpensesModel, PropositionModel, PropositionsReadOptionsModel, PropositionViewModel } from 'src/repositories/models';
import { IProposition, IPropositionTextEditor, IPropositonAddURL, IServiceOptions } from 'src/repositories/types';
import { convertBlobToString, convertDataValues, existsOrError, isRequired, notExistisOrError, setValueNumberToView } from 'src/utils';
import { DatabaseService } from './abistract-database.service';
import { GovernmentExpensesService } from './government-expenses.service';

export class PropositionService extends DatabaseService {
	constructor(
		options: IServiceOptions,
		private governmentExpenseService: GovernmentExpensesService
	) {
		super(options);
	}

	async create(data: PropositionModel, req: Request) {
		try {
			const unitFromDB = await this.verifyUnit(data.unitId, data.tenancyId);
			existsOrError(unitFromDB, { message: 'unit not found', status: BAD_REQUEST });

			const fromDB = (await this.getProprosition(data.title, data.tenancyId)) as PropositionViewModel;

			notExistisOrError(fromDB?.id, { messsage: 'Proposition alredy existis', status: FORBIDDEN });
			const toSave = new Proposition({ ...data, active: true } as IProposition);
			const [id] = await this.db('propositions').insert(convertDataValues(toSave));

			existsOrError(Number(id), { message: 'Internal error', error: id, status: INTERNAL_SERVER_ERROR });
			if (data.keywords.length !== 0) await this.setKeywords(data.keywords, id);
			if (data.themes.length !== 0) await this.setThemes(data.themes, id);
			if (data.demands?.length !== 0) await this.setDemands(data.demands as number[], id);
			const governmentExpense = data?.expense ? await this.setGovernmentExpense(data, id, req) : undefined;
			await this.setTasks(data, id, req);

			const file = data?.file ? await this.setFile(data.file, 'propositionId', id) : undefined;

			await this.userLogService.create(getUserLogData(req, 'propositions', id, 'salvar'));

			return { message: 'Proposition saved with success', data: { ...data, id, governmentExpense, file } };
		} catch (err) {
			return err;
		}
	}

	async update(data: PropositionModel, id: number, req: Request) {
		try {
			if (data?.unitId) {
				const unitFromDB = await this.verifyUnit(data.unitId, data.tenancyId);
				existsOrError(unitFromDB, { message: 'unit not found', status: BAD_REQUEST });
			}

			const fromDB = (await this.getProprosition(id, data.tenancyId)) as PropositionViewModel;
			existsOrError(fromDB?.id, { message: 'Not found', status: NOT_FOUND });

			const active = data.active !== null && data.active !== undefined ? data.active : fromDB.active;
			const toUpdate = new Proposition({ ...fromDB, ...data, tenancyId: fromDB.tenancyId, active });

			await this.db('propositions').where({ id }).andWhere({ tenancy_id: fromDB.tenancyId }).update(convertDataValues(toUpdate));

			if (data?.expense) {
				await this.setGovernmentExpense(data, id, req);
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

			if (data?.tasks?.length) await this.setTasks(data, id, req);
			if (data?.file) await this.setFile(data.file, 'propositionId', id);

			await this.userLogService.create(getUserLogData(req, 'propositions', id, 'atualizar'));

			return { message: 'Proposition updated with success', data: { ...toUpdate, ...data } };
		} catch (err) {
			return err;
		}
	}

	async getDataToEditor(id: number) {
		try {
			const fromDB = await this.db('propositions').where({ id }).select('id', 'type_id', 'text_editor').first();

			existsOrError(fromDB, { message: 'Propositions not found', status: NOT_FOUND });
			notExistisOrError(fromDB?.severity === 'ERROR', { message: 'Internal Server Error', err: fromDB, status: INTERNAL_SERVER_ERROR });

			const data = convertDataValues(fromDB, 'camel');
			return { ...data, id: Number(data.id), textEditor: convertBlobToString(data.textEditor) };
		} catch (err) {
			return err;
		}
	}

	async insertTextEditor(data: IPropositionTextEditor, req: Request) {
		try {
			const fromDB = await this.db('propositions').where('id', data.id).first();

			existsOrError(fromDB, { message: 'Proposition not found', status: NOT_FOUND });
			notExistisOrError(fromDB?.severity === 'ERROR', { message: 'Internal Error', err: fromDB, status: INTERNAL_SERVER_ERROR });

			const toUpdate = new Proposition({
				...convertDataValues(fromDB, 'camel'),
				expense: fromDB?.expense ? fromDB.expense / 100 : undefined,
				textEditor: data.textEditor,
				typeId: data.typeId || fromDB.type_id,
			});

			await this.db('propositions').where('id', data.id).update(convertDataValues(toUpdate));
			await this.userLogService.create(getUserLogData(req, 'propositions', data.id, 'atualizar'));

			return { message: 'file to editor insert sucessfully', data: { ...toUpdate } };
		} catch (err) {
			return err;
		}
	}

	async read(options: PropositionsReadOptionsModel, id?: number) {
		try {
			const { tenancyId, unitId } = options;

			existsOrError(tenancyId, { message: isRequired('tenancyId'), status: BAD_REQUEST });
			if (id) return this.getProprosition(id, tenancyId as number);

			const table = { p: 'propositions', t: 'types' };
			const fields = [
				{
					id: 'p.id',
					title: 'p.title',
					favorite: 'p.favorite',
					deadline: 'p.deadline',
					active: 'p.active',
					menu: 'p.menu',
					expense: 'p.expense',
					link: 'p.proposition_url',
					text_editor: 'p.text_editor',
				},
				{ type_id: 't.id', type: 't.name' },
			];

			const fromDB = unitId
				? await this.db(table)
					.select(...fields)
					.where('p.tenancy_id', tenancyId)
					.andWhereRaw(`p.unit_id = ${unitId}`)
					.andWhereRaw('t.id = p.type_id')
				: await this.db(table)
					.select(...fields)
					.where('p.tenancy_id', tenancyId)
					.andWhereRaw('t.id = p.type_id');

			existsOrError(Array.isArray(fromDB), { message: 'Internal error', status: INTERNAL_SERVER_ERROR, err: fromDB });
			const raw = fromDB.map((i: any) => convertDataValues(i, 'camel'));

			const res: any[] = [];

			for (const item of raw) {
				const { id } = item;
				const themesRaw = await this.getThemes(id);
				const keywordsRaw = await this.getKeywords(id);
				const budgets = await this.getBudgets(id);

				const favorite = !!item.favorite;
				const active = !!item.active;
				const themes = themesRaw.map((i: any) => i.name).join('/');
				const keywords = keywordsRaw.map((i: any) => i.keyword).join(', ');
				const expense = setValueNumberToView(item.expense);
				const menu = convertBlobToString(item.menu);
				const textEditor = convertBlobToString(item.textEditor);

				res.push({ ...item, favorite, active, expense, themes, keywords, menu, budgets, textEditor });
			}

			onLog('res ponse propositions', res);

			return res;
		} catch (err) {
			return err;
		}
	}

	async getProprosition(value: number | string, tenancyId: number) {
		try {
			const fromDB = await this.db({ p: 'propositions', t: 'types', u: 'units' })
				.select(
					{
						id: 'p.id',
						title: 'p.title',
						menu: 'p.menu',
						deadline: 'p.deadline',
						active: 'p.active',
						expense: 'p.expense',
						tenancy_id: 'p.tenancy_id',
						parent_id: 'p.parent_id',
						text_editor: 'p.text_editor',
					},
					{ unit_id: 'u.id', unit_name: 'u.name' },
					{ type_id: 't.id', type_name: 't.name' }
				)
				.where('p.id', value)
				.andWhere('p.tenancy_id', tenancyId)
				.andWhereRaw('t.id = p.type_id')
				.andWhereRaw('u.id = p.unit_id')
				.orWhere('title', value)
				.first();

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

			const budgets = await this.getBudgets(fromDB.id);
			const keywords = await this.getKeywords(fromDB.id);
			const themes = await this.getThemes(fromDB?.id);
			const tasks = await this.getTasksProposition(fromDB.id);
			const file = await this.getFile(fromDB.id);

			return new PropositionViewModel(
				convertDataValues(
					{
						...fromDB,
						budgets,
						demands,
						keywords,
						themes,
						tasks,
						file,
					},
					'camel'
				)
			);
		} catch (err) {
			return err;
		}
	}

	async disabled(id: number, tenancyId: number, req: Request) {
		try {
			const fromDB = (await this.getProprosition(id, tenancyId)) as PropositionViewModel;
			existsOrError(fromDB.id, { message: 'Not found', status: NOT_FOUND });

			const toDesabled = new Proposition({ ...fromDB, active: false });

			await this.db('propositions').where({ id }).andWhere({ tenancy_id: tenancyId }).update(convertDataValues(toDesabled));
			if (fromDB.expense) {
				await this.db('government_expenses').where('proposition_id', id).andWhere('tenancy_id', fromDB.tenancyId).update({ active: false });
			}

			await this.userLogService.create(getUserLogData(req, 'propositions', id, 'desabilitar'));

			return { message: 'Proposition disabled with success', data: { ...fromDB, ...toDesabled } };
		} catch (err) {
			return err;
		}
	}

	async favorite(id: number, req: Request) {
		return super
			.favoriteItem('propositions', id)
			.then(async res => {
				await this.userLogService.create(getUserLogData(req, 'propositions', id, 'favoritar'));
				return res;
			})
			.catch(err => err);
	}

	async addUrl(data: IPropositonAddURL, id: number, req: Request) {
		try {
			const { propositionUrl, tenancyId } = data;
			const fromDB = (await this.getProprosition(id, tenancyId)) as any;

			onLog('fromDB proposition', fromDB);
			existsOrError(fromDB?.id, fromDB);
			const toUpdate = new Proposition({ ...fromDB, propositionUrl, tenancyId }, id);

			onLog('to update proposition', toUpdate);
			await this.db('propositions').where({ id }).andWhere('tenancy_id', tenancyId).update(convertDataValues(toUpdate));
			await this.userLogService.create(getUserLogData(req, 'propositions', id, 'adicionar URL'));

			return { message: `Url: ${propositionUrl}, sucessfully added` };
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

	private async setTasks(data: PropositionModel, propositionId: number, req: Request) {
		try {
			const { tasks, themes } = data;
			for (const task of tasks) {
				onLog('task to save', task);
				await this.setPropositionTask(task, themes, propositionId, req);
			}
		} catch (err) {
			return err;
		}
	}

	private async setGovernmentExpense(data: PropositionModel, propositionId: number, req: Request) {
		try {
			const fromDB = await this.db('government_expenses').where('proposition_id', propositionId).first();

			if (fromDB?.id) {
				const governmentExpense = new GovernmentExpensesModel(
					{
						expense: data.title,
						description: data.menu,
						dueDate: data.deadline,
						value: Number(data.expense) * 100,
						budgets: data.budgets,
						tenancyId: data.tenancyId,
						active: true,
						propositionId,
					},
					Number(fromDB.id)
				);

				await this.governmentExpenseService.update(governmentExpense, Number(fromDB.id), req);

				return governmentExpense;
			}

			const governmentExpense = new GovernmentExpensesModel({
				expense: data.title,
				description: data.menu,
				dueDate: data.deadline,
				value: Number(data.expense) * 100,
				budgets: data.budgets,
				tenancyId: data.tenancyId,
				active: true,
				propositionId,
			});

			await this.governmentExpenseService.create(governmentExpense, req);

			return governmentExpense;
		} catch (err) {
			return err;
		}
	}

	private async getBudgets(propositionId: number) {
		try {
			const fromDB = await this.db({ ge: 'government_expenses', gep: 'government_expenses_payment', r: 'revenues' })
				.select({ id: 'r.id', revenue: 'r.revenue' }, { value: 'gep.value', date: 'gep.date' })
				.where('ge.proposition_id', propositionId)
				.andWhereRaw('gep.government_expense_id = ge.id')
				.andWhereRaw('r.id = gep.revenue_id')
				.orderBy('gep.date', 'desc');

			existsOrError(Array.isArray(fromDB), { message: 'Internal Error', err: fromDB, status: INTERNAL_SERVER_ERROR });

			return fromDB.map(i => convertDataValues(i, 'camel'));
		} catch (err) {
			return err;
		}
	}

	private async setPropositionTask(data: Task, themes: string[], propositionId: number, req: Request) {
		try {
			const fromDB = await this.db('tasks').where({ title: data.title }).andWhere({ tenancy_id: data.tenancyId }).first();

			onLog('task from db', fromDB);

			if (fromDB?.id) {
				const toUpdate = new Task({ ...convertDataValues(fromDB, 'camel'), ...data, propositionId, tenancyId: Number(fromDB.tenancy_id) });

				await this.db('tasks').where({ id: fromDB.id }).andWhere({ tenancy_id: data.tenancyId }).update(convertDataValues(toUpdate));
				await this.setThemesTasks(themes, Number(fromDB));

				await this.userLogService.create(getUserLogData(req, 'tasks', fromDB?.id, 'atualizar'));

				return;
			}

			const [id] = await this.db('tasks').insert(convertDataValues({ ...data, propositionId }));
			onLog('save task', id);
			existsOrError(Number(id), { message: 'Internal error', error: id, status: INTERNAL_SERVER_ERROR });

			await this.userLogService.create(getUserLogData(req, 'tasks', id, 'salvar'));
		} catch (err) {
			return err;
		}
	}

	private async setThemesTasks(themes: string[], taskId: number) {
		try {
			await this.db('themes_tasks').where('task_id', taskId).del();

			for (const name of themes) {
				const theme = await this.db('themes').where({ name }).first();

				if (theme?.id) {
					const { id: themeId } = theme;
					await this.db('themes_tasks').insert(convertDataValues({ themeId, taskId }));
				}
			}
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
			notExistisOrError(fromDB?.severity === 'ERROR', {
				message: 'Internal Error',
				err: fromDB,
				status: INTERNAL_SERVER_ERROR,
			});

			return fromDB?.id ? new FileEntity(convertDataValues(fromDB, 'camel')) : fromDB;
		} catch (err) {
			return err;
		}
	}

	private async getThemes(propositionId: number) {
		const fromDB = await this.db({ pt: 'propositions_themes', t: 'themes' })
			.select({ id: 't.id', name: 't.name' })
			.where('pt.proposition_id', propositionId)
			.andWhereRaw('t.id = pt.theme_id');

		return fromDB.map(i => convertDataValues(i, 'camel'));
	}

	private async getKeywords(propositionId: number) {
		onLog('propositionId keyword', propositionId);
		const fromDB = await this.db({ pk: 'propositions_keywords', k: 'keywords' })
			.select({ id: 'k.id', keyword: 'k.keyword' })
			.where('pk.proposition_id', propositionId)
			.andWhereRaw('k.id = pk.keyword_id');

		onLog('keyword raw', fromDB);

		return fromDB.map(i => convertDataValues(i, 'camel'));
	}
}
