import { BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';
import { Proposition, Task } from 'src/repositories/entities';
import { PropositionModel, PropositionsReadOptionsModel, PropositionViewModel } from 'src/repositories/models';
import { IProposition, IServiceOptions } from 'src/repositories/types';
import { convertDataValues, existsOrError, isRequired, notExistisOrError } from 'src/utils';
import { DatabaseService } from './abistract-database.service';

export class PropositionService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: PropositionModel) {
		try {
			const fromDB = (await this.getProprosition(data.title, data.tenancyId)) as PropositionViewModel;

			notExistisOrError(fromDB.id, { messsage: 'Proposition alredy existis', status: FORBIDDEN });
			notExistisOrError(fromDB, { message: 'Internal error', error: fromDB, status: INTERNAL_SERVER_ERROR });
			const toSave = new Proposition({ ...data, active: true } as IProposition);
			const [id] = await this.db('propositions').insert(convertDataValues(toSave));

			existsOrError(Number(id), { message: 'Internal error', error: id, status: INTERNAL_SERVER_ERROR });
			if (data.budgets) await this.setBudgets(data.budgets, id);
			if (data.keywords.length !== 0) await this.setKeywords(data.keywords, id);
			if (data.themes.length !== 0) await this.setThemes(data.themes, id);
			if (data.demands?.length !== 0) await this.setDemands(data.demands as number[], id);
			await await this.setTasks(data.tasks, id);

			return { message: 'Proposition saved with success', data: { ...data, id } };
		} catch (err) {
			return err;
		}
	}

	async update(data: PropositionModel, id: number) {
		try {
			const fromDB = (await this.getProprosition(id, data.tenancyId)) as PropositionViewModel;

			existsOrError(fromDB.id, { message: 'Not found', status: NOT_FOUND });
			const toUpdate = new Proposition({ ...fromDB, ...data, tenancyId: fromDB.tenancyId });
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

			if (unitId) {
				return this.db('propositions')
					.select('id', 'title', 'deadline', 'active')
					.where({ unit_id: unitId })
					.andWhere({ tenancy_id: tenancyId })
					.then(res => {
						existsOrError(Array.isArray(res), { message: 'Internal error', error: res, status: INTERNAL_SERVER_ERROR });
						return res.map(i => convertDataValues(i, 'camel'));
					})
					.catch(err => err);
			}

			return this.db('propositions')
				.select('id', 'title', 'deadline', 'active')
				.andWhere({ tenancy_id: tenancyId })
				.then(res => {
					existsOrError(Array.isArray(res), { message: 'Internal error', error: res, status: INTERNAL_SERVER_ERROR });
					return res.map(i => convertDataValues(i, 'camel'));
				})
				.catch(err => err);
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

			return new PropositionViewModel(convertDataValues({ ...fromDB, budgets, demands, keywords, themes, tasks }, 'camel'));
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

			return { message: 'Proposition disabled with success', data: { ...fromDB, ...toDesabled } };
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
				await this.setPropositionTask(task, propositionId);
			}
		} catch (err) {
			return err;
		}
	}

	private async setBudgets(budgets: number[], id: number) {
		try {
			for (const revenueId of budgets) {
				await this.db('budget_proposals').insert(convertDataValues({ revenueId, propositionId: id }));
			}
		} catch (err) {
			return err;
		}
	}

	private async setPropositionTask(data: Task, propositionId: number) {
		try {
			const fromDB = await this.db('tasks').where({ title: data.title }).andWhere({ tenancy_id: data.tenancyId }).first();

			if (fromDB.id) {
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

			existsOrError(Number(id), { message: 'Internal error', error: id, status: INTERNAL_SERVER_ERROR });

			return;
		} catch (err) {
			return err;
		}
	}

	private async setKeywords(keywords: string[], id: number) {
		try {
			for (const keyword of keywords) {
				const fromDB = await this.db('keywords').where({ keyword }).first();

				if (!fromDB.id) {
					const [keywordId] = await this.db('keywords').insert(convertDataValues({ keyword }));
					await this.db('propositions_keywords').insert(convertDataValues({ keywordId, propositionId: id }));
					return;
				}

				await this.db('propositions_keywords').insert(convertDataValues({ keywordId: fromDB.id, propositionId: id }));
			}
		} catch (err) {
			return err;
		}
	}

	private async setThemes(themes: string[], propositionsId: number) {
		try {
			for (const theme of themes) {
				const fromDB = await this.db('themes').where({ name: theme }).first();

				if (!fromDB.id) {
					const [themeId] = await this.db('themes').insert(convertDataValues({ name: theme }));
					await this.db('propositions_themes').insert(convertDataValues({ themeId, propositionsId }));
					return;
				}

				await this.db('propositions_themes').insert(convertDataValues({ themeId: fromDB.id, propositionsId }));
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
						task: 't.task',
						deadline: 't.deadline',
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
}
