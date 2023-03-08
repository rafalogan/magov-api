import { BAD_REQUEST, NOT_FOUND } from 'http-status';
import { Demand, Keyword, Plaintiff, Plan, Theme } from 'src/repositories/entities';
import { DemandModel, DemandViewModel, ReadOptionsModel, PlaintiffModel } from 'src/repositories/models';
import { IDemand, IDemands, IPlantiff, IServiceOptions, ITheme } from 'src/repositories/types';
import { convertDataValues, convertToDate, existsOrError, isRequired } from 'src/utils';
import { DatabaseService } from './abistract-database.service';
import { KeywordService } from './keyword.service';

export class DemandService extends DatabaseService {
	constructor(options: IServiceOptions, private keywordService: KeywordService) {
		super(options);
	}

	async create(data: DemandModel) {
		try {
			const plaintiffId = await this.setPlaintiff(data, data.plaintiff?.id);

			const demandToSave = new Demand({ ...data, active: data.active || true, plaintiffId } as IDemand);
			const [id] = await this.db('demands').insert(convertDataValues(demandToSave));

			if (data.keywords?.length !== 0) await this.setKeywords(data.keywords, id);
			if (data.themes.length !== 0) await this.setThemes(data.themes, id);

			return { message: 'Demand saved successfully', data: { ...data, id } };
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

			return { message: 'Demand updated successfully', data: demandToUpdate };
		} catch (err) {
			return err;
		}
	}

	read(options: ReadOptionsModel, id?: number) {
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

	async getDemands(options: ReadOptionsModel) {
		try {
			const { tenancyId: tenancy_id, order, orderBy } = options;
			const demandsRaw = await this.db({ d: 'demenads', p: 'plaintiffs', a: 'adresses', u: 'users' })
				.select('*.d', { plaintiff: 'p.name' }, { responsible: 'u.name' }, { uf: 'a.uf', city: 'a.city', district: 'a.district' })
				.where({ tenancy_id })
				.andWhereRaw('p.id = d.plaintiff_id')
				.andWhereRaw('u.id = d.user_id')
				.andWhereRaw('a.plaintiff_id = d.plaintiff_id')
				.orderBy(orderBy || 'd.id', order || 'asc');

			const demands = (await this.setTasksperDemands(demandsRaw)) as IDemands[];

			return demands.map(i => convertDataValues(i, 'camel'));
		} catch (err) {
			return err;
		}
	}

	async getDemand(id: number) {
		try {
			const fromDB = (await this.db('demenads').where({ id }).first()) as IDemand;
			existsOrError(fromDB.id, { message: 'Demand Not Found', status: NOT_FOUND });
			const raw = convertDataValues(fromDB, 'camel') as IDemand;

			const plaintiff = await this.db('plaintiffs').where({ id: raw.plaintiffId }).first();
			const contact = await this.db('contacts').where({ plaintiff_id: plaintiff.id });
			const address = await this.db('adresses').where({ plaintiff_id: plaintiff.id }).first();

			const themesIds = await this.db('demands_themes').where({ demand_id: raw.id });
			const keywordsIds = await this.db('demands_keywords').where({ demand_id: raw.id });

			const themes = (await this.findAllDadaByArray(
				'themes',
				themesIds.map(({ theme_id: id }) => id)
			)) as ITheme[];
			const keywords = await this.findAllDadaByArray(
				'keywords',
				keywordsIds.map(({ keyword_id: id }) => id)
			);

			return new DemandViewModel({
				...raw,
				plaintiff: {
					...convertDataValues(plaintiff, 'camel'),
					address: convertDataValues(address, 'camel'),
					...convertDataValues(contact, 'camel'),
				},
				themes,
				keywords,
			});
		} catch (err) {
			return err;
		}
	}

	async findKeywordId(value: string) {
		try {
			const keyword = await this.keywordService.read(value);

			if (keyword.id) return keyword.id;
			const [id] = await this.db('keywords').insert({ name: value });
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

	private async setPlaintiff(value: DemandModel, plaintiffId?: number) {
		try {
			if (plaintiffId) return plaintiffId;

			const data = new Plaintiff({ ...value.plaintiff, tenancyId: value.tenancyId } as IPlantiff);
			const { email, phone, address } = value.plaintiff;
			const [id] = await this.db('plaintiffs').insert(convertDataValues(data));
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
