import { BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';
import { onLog } from 'src/core/handlers';
import { Demand, Plaintiff } from 'src/repositories/entities';
import { DemandListModel, DemandModel, DemandViewModel, PlaintiffModel, ReadOptionsModel } from 'src/repositories/models';
import { IDemand, IDemands, IPlantiff, IPlantiffModel, IServiceOptions, ITheme } from 'src/repositories/types';
import { convertDataValues, equalsOrError, existsOrError, isRequired } from 'src/utils';
import { DatabaseService } from './abistract-database.service';
import { KeywordService } from './keyword.service';

export class DemandService extends DatabaseService {
	constructor(options: IServiceOptions, private keywordService: KeywordService) {
		super(options);
	}

	async create(data: DemandModel) {
		try {
			const plaintiffId = await this.setPlaintiff({ ...data.plaintiff, tenancyId: data.tenancyId, active: data.active });

			existsOrError(Number(plaintiffId), { messsage: 'Internal Server Errro', err: plaintiffId, status: INTERNAL_SERVER_ERROR });

			const demandToSave = new Demand({ ...data, active: data.active || true, plaintiffId } as IDemand);
			onLog('demand To Save', demandToSave);
			const [id] = await this.db('demands').insert(convertDataValues(demandToSave));

			existsOrError(Number(id), { messsage: 'Internal Server Error', err: id, status: INTERNAL_SERVER_ERROR });

			onLog('keywords', data.keywords.length);

			if (data.keywords?.length !== 0) await this.setKeywords(data.keywords, Number(id));
			if (data.themes.length !== 0) await this.setThemes(data.themes, Number(id));

			return { message: 'Demand saved successfully', data: { ...data, id } };
		} catch (err) {
			return err;
		}
	}

	async updateDemand(data: DemandModel, id: number, tenancyId: number) {
		try {
			const demand = (await this.getDemand(id)) as DemandViewModel;

			existsOrError(demand.id, { message: 'Demand not found', status: NOT_FOUND });
			equalsOrError(demand.tenancyId, tenancyId, { message: "User can't execute this action", status: FORBIDDEN });

			if (data.keywords.length !== 0) {
				await this.db('demands_keywords').where({ demand_id: id }).del();
				await this.setKeywords(data.keywords, id);
			}

			if (data.themes.length !== 0) {
				await this.db('demands_themes').where({ demand_id: id }).del();
				await this.setThemes(data.themes, id);
			}

			const demandToUpdate = new Demand(
				{ ...demand, ...data, plaintiffId: demand.plaintiff.id as number, tenancyId: demand.tenancyId },
				id
			);
			await this.db('demands').where({ id }).update(convertDataValues(demandToUpdate));

			return {
				message: 'Demand updated successfully',
				data: {
					...demand,
					...demandToUpdate,
					Plaintiff: demand.plaintiff,
					themes: data.themes,
					keywords: data.keywords,
				},
			};
		} catch (err) {
			return err;
		}
	}

	async update(data: DemandModel, id: number) {
		try {
			const demand = (await this.getDemand(id)) as DemandViewModel;

			existsOrError(demand.id, { message: 'Demand not found', status: NOT_FOUND });

			if (data.keywords.length !== 0) {
				await this.db('demands_keywords').where({ demand_id: id }).del();
				await this.setKeywords(data.keywords, id);
			}

			if (data.themes.length !== 0) {
				await this.db('demands_themes').where({ demand_id: id }).del();
				await this.setThemes(data.themes, id);
			}

			const demandToUpdate = new Demand({ ...demand, ...data, plaintiffId: data.plaintiff.id as number }, id);
			await this.db('demands').where({ id }).update(convertDataValues(demandToUpdate));

			return {
				message: 'Demand updated successfully',
				data: {
					...demand,
					...demandToUpdate,
					Plaintiff: demand.plaintiff,
					themes: data.themes,
					keyword: data.keywords,
				},
			};
		} catch (err) {
			return err;
		}
	}

	async read(options: ReadOptionsModel, id?: number) {
		try {
			if (id) return this.getDemand(id);

			existsOrError(options.tenancyId, { message: isRequired('Param tenancyId'), status: BAD_REQUEST });
			return this.getDemands(options)
				.then(res => res)
				.catch(err => err);
		} catch (err) {
			return err;
		}
	}

	async disabled(id: number, tenancyId: number) {
		try {
			const data = (await this.getDemand(id)) as DemandViewModel;
			existsOrError(data.id, { message: 'Denand not found', status: NOT_FOUND });
			equalsOrError(data.tenancyId, tenancyId, { message: "User can't execute this action", status: FORBIDDEN });

			const toDesabled = new Demand({ ...data, plaintiffId: data.plaintiff.id as number, active: false } as IDemand);
			await this.db('demands').where({ id }).update(convertDataValues(toDesabled));

			return { message: 'Demand disabled successfully', data: { ...data, active: false } };
		} catch (err) {
			return err;
		}
	}

	async getDemands(options: ReadOptionsModel) {
		try {
			const { tenancyId: tenancy_id, order, orderBy } = options;
			const demandsRaw = await this.db({ d: 'demands', p: 'plaintiffs', a: 'adresses', u: 'users' })
				.select(
					{
						id: 'd.id',
						name: 'd.name',
						favorite: 'd.favorite',
						level: 'd.level',
						description: 'd.description',
						dead_line: 'd.dead_line',
						created_at: 'd.created_at',
						user_id: 'd.user_id',
						plaintiff_id: 'd.plaintiff_id',
					},
					{ plaintiff: 'p.name' },
					{ first_name_responsible: 'u.first_name', last_name_responsible: 'u.last_name' },
					{ uf: 'a.uf', city: 'a.city', district: 'a.district' }
				)
				.where('d.tenancy_id', tenancy_id)
				.andWhereRaw('p.id = d.plaintiff_id')
				.andWhereRaw('u.id = d.user_id')
				.andWhereRaw('a.plaintiff_id = d.plaintiff_id')
				.orderBy(orderBy || 'd.id', order || 'asc');

			const demands = (await this.setTasksperDemands(demandsRaw)) as IDemands[];

			return demands.map(i => new DemandListModel(convertDataValues(i, 'camel')));
		} catch (err) {
			return err;
		}
	}

	async getDemand(id: number) {
		try {
			const fromDB = (await this.db({ d: 'demands', p: 'plaintiffs', a: 'adresses', c: 'contacts', u: 'users' })
				.select(
					{
						id: 'd.id',
						name: 'd.name',
						description: 'd.description',
						favorite: 'd.favorite',
						level: 'd.level',
						active: 'd.active',
						dead_line: 'd.dead_line',
						status: 'd.status',
						created_at: 'd.created_at',
						unit_id: 'd.unit_id',
						user_id: 'd.user_id',
						plaintiff_id: 'd.plaintiff_id',
						tenancy_id: 'd.tenancy_id',
					},
					{
						plaintiff: 'p.name',
						birthday: 'p.birthday',
						cpf_cnpj: 'p.cpf_cnpj',
						institute: 'p.institute',
						relationship_type: 'p.relationship_type',
						relatives: 'p.relatives',
						voter_registration: 'p.voter_registration',
						parent_id: 'p.parent_id',
						institute_type_id: 'p.institute_type_id',
					},
					{ email: 'c.email', phone: 'c.phone' },
					{
						cep: 'a.cep',
						street: 'a.street',
						number: 'a.number',
						complement: 'a.complement',
						district: 'a.district',
						city: 'a.city',
						uf: 'a.uf',
					},
					{ user_first_name: 'u.first_name', user_last_name: 'u.last_name' }
				)
				.where('d.id', id)
				.andWhereRaw('p.id = d.plaintiff_id')
				.andWhereRaw('a.plaintiff_id = d.plaintiff_id')
				.andWhereRaw('u.id = d.user_id')
				.andWhereRaw('c.plaintiff_id = d.plaintiff_id')
				.first()) as IDemand;

			onLog('demand Raw', fromDB);
			existsOrError(fromDB?.id, { message: 'Demand Not Found', status: NOT_FOUND });
			const raw = convertDataValues(fromDB, 'camel');
			onLog('raw', raw);
			const themesIds = await this.db('demands_themes').where({ demand_id: raw.id });
			const keywordsIds = await this.db('demands_keywords').where({ demand_id: raw.id });

			onLog(
				'keywords id',
				keywordsIds.map(({ keyword_id }) => keyword_id)
			);

			const themes = (await this.findAllDadaByArray(
				'themes',
				themesIds.map(({ theme_id }) => theme_id)
			)) as ITheme[];
			const keywords = await this.findAllDadaByArray(
				'keywords',
				keywordsIds.map(({ keyword_id }) => keyword_id)
			);

			return new DemandViewModel({ ...raw, themes, keywords });
		} catch (err) {
			return err;
		}
	}

	async findKeywordId(value: string) {
		try {
			const keyword = await this.keywordService.read(value);

			if (keyword?.id) return keyword.id;

			const [id] = await this.db('keywords').insert({ keyword: value });
			existsOrError(Number(id), { message: 'Internal error', err: id, status: INTERNAL_SERVER_ERROR });
			return id;
		} catch (err) {
			return err;
		}
	}

	async findThemeId(value: string) {
		try {
			const theme = await this.db('themes').where({ name: value }).first();
			if (theme?.id) return theme.id;

			const [id] = await this.db('themes').insert({ name: value, active: true });
			existsOrError(Number(id), { message: 'Internal error', err: id, status: INTERNAL_SERVER_ERROR });

			return id;
		} catch (err) {
			return err;
		}
	}

	private async setTasksperDemands(demands: IDemands[]) {
		try {
			const result: any[] = [];
			for (const demand of demands) {
				const tasks = (await this.db('tasks').select('id', 'title').where({ demand_id: demand.id }).where({ demand_id: demand.id })) || [];
				result.push({ ...demand, tasks });
			}

			return result as IDemands[];
		} catch (err) {
			return err;
		}
	}

	private async setKeywords(keywords: string[], id: number) {
		try {
			for (const keyword of keywords) {
				const kwId = await this.findKeywordId(keyword);

				existsOrError(Number(kwId), { message: 'Internal error', err: kwId, status: INTERNAL_SERVER_ERROR });
				await this.db('demands_keywords').insert({ demand_id: id, keyword_id: kwId });
			}
		} catch (err) {
			return err;
		}
	}

	private async setThemes(themes: string[], id: number) {
		try {
			for (const theme of themes) {
				const thId = await this.findThemeId(theme);
				await this.db('demands_themes').insert({ demand_id: id, theme_id: thId });
			}
		} catch (err) {
			return err;
		}
	}

	private async setPlaintiff(value: IPlantiffModel) {
		try {
			if (value.id) return Number(value.id);

			const fromDB = await this.db('plaintiffs').where({ cpf_cnpj: value.cpfCnpj }).andWhere({ tenancy_id: value.tenancyId }).first();
			if (fromDB?.id) return Number(fromDB.id);

			const data = new Plaintiff({ ...value } as IPlantiff);
			const { email, phone, address } = value;
			const [id] = await this.db('plaintiffs').insert(convertDataValues(data));
			existsOrError(Number(id), { message: 'Internal error', err: id, status: INTERNAL_SERVER_ERROR });

			if (Number(id)) {
				await this.db('contacts').insert(convertDataValues({ email, phone, tenancyId: value.tenancyId, plaintiffId: id }));
				await this.db('adresses').insert(convertDataValues({ ...address, plaintiffId: id }));
			}

			return id;
		} catch (err) {
			return err;
		}
	}
}
