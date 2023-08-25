import { Request } from 'express';
import { BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';

import { getUserLogData, onLog } from 'src/core/handlers';
import { Demand, Plaintiff } from 'src/repositories/entities';
import { DemandModel, DemandViewModel, ReadOptionsModel } from 'src/repositories/models';
import { IDemand, IPlantiff, IPlantiffModel, IServiceOptions, ITheme } from 'src/repositories/types';
import {
	convertBlobToString,
	convertDataValues,
	equalsOrError,
	existsOrError,
	isDataInArray,
	isRequired,
	notExistisOrError,
	setValueNumberToView,
} from 'src/utils';
import { DatabaseService } from './abistract-database.service';
import { KeywordService } from './keyword.service';

export class DemandService extends DatabaseService {
	constructor(
		options: IServiceOptions,
		private keywordService: KeywordService
	) {
		super(options);
	}

	async create(data: DemandModel, req: Request) {
		try {
			const fromDB = await this.db('demands').where('name', data.name).andWhere('tenancy_id', data.tenancyId).first();
			notExistisOrError(fromDB?.id, { message: 'Demand already existis', status: FORBIDDEN });

			if (data?.plaintiff?.id) return this.createSimpleDemand(data, req);
			return this.createDemandAndPlantiff(data, req);
		} catch (err) {
			return err;
		}
	}

	async createSimpleDemand(data: DemandModel, req: Request) {
		try {
			const plaintiffId = Number(data.plaintiff.id);
			existsOrError(Number(plaintiffId), { messsage: 'Error plaintiff not found', status: INTERNAL_SERVER_ERROR });

			const demand = new Demand({ ...data, plaintiffId });
			const id = await this.saveDemand(demand, data.keywords, data.themes, req);
			existsOrError(Number(id), id);

			return { message: 'Demand saved successfully', data: { ...data, id } };
		} catch (err) {
			return err;
		}
	}

	async createDemandAndPlantiff(data: DemandModel, req: Request) {
		try {
			const plaintiffId = await this.setPlaintiff({ ...data.plaintiff, tenancyId: data.tenancyId, active: data.active });
			existsOrError(Number(plaintiffId), { messsage: 'Error plaintiff not found', status: INTERNAL_SERVER_ERROR });

			await this.userLogService.create(getUserLogData(req, 'plantiffs', Number(plaintiffId), 'salvar/editar'));

			const demand = new Demand({ ...data, plaintiffId: Number(plaintiffId) });
			const id = await this.saveDemand(demand, data.keywords, data.themes, req);
			existsOrError(Number(id), id);

			return { message: 'Demand saved successfully', data: { ...data, id } };
		} catch (err) {
			return err;
		}
	}

	async saveDemand(data: Demand, keywords: string[], themes: string[], req: Request) {
		try {
			const [id] = await this.db('demands').insert(convertDataValues({ ...data, active: true }));
			existsOrError(Number(id), { messsage: 'Internal Server Error', err: id, status: INTERNAL_SERVER_ERROR });

			if (isDataInArray(keywords)) await this.setKeywords(keywords, Number(id));
			if (isDataInArray(themes)) await this.setThemes(themes, Number(id));

			await this.userLogService.create(getUserLogData(req, 'demands', id, 'salvar'));

			return Number(id);
		} catch (err) {
			return err;
		}
	}

	async updateDemand(data: DemandModel, id: number, tenancyId: number, req: Request) {
		try {
			const demand = (await this.getDemand(id)) as DemandViewModel;

			existsOrError(demand.id, { message: 'Demand not found', status: NOT_FOUND });
			equalsOrError(demand.tenancyId, tenancyId, { message: "User can't execute this action", status: FORBIDDEN });

			if (isDataInArray(data.keywords)) {
				await this.db('demands_keywords').where({ demand_id: id }).del();
				await this.setKeywords(data.keywords, id);
			}

			if (isDataInArray(data.themes)) {
				await this.db('demands_themes').where({ demand_id: id }).del();
				await this.setThemes(data.themes, id);
			}

			const demandToUpdate = new Demand(
				{ ...demand, ...data, plaintiffId: demand.plaintiff.id as number, tenancyId: demand.tenancyId },
				id
			);
			await this.db('demands').where({ id }).update(convertDataValues(demandToUpdate));
			await this.userLogService.create(getUserLogData(req, 'demands', id, 'atualizar'));

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

	async update(data: DemandModel, id: number, req: Request) {
		try {
			const demand = (await this.getDemand(id)) as DemandViewModel;

			existsOrError(demand.id, { message: 'Demand not found', status: NOT_FOUND });

			if (isDataInArray(data.keywords)) {
				await this.db('demands_keywords').where({ demand_id: id }).del();
				await this.setKeywords(data.keywords, id);
			}

			if (isDataInArray(data.themes)) {
				await this.db('demands_themes').where({ demand_id: id }).del();
				await this.setThemes(data.themes, id);
			}

			const demandToUpdate = new Demand({ ...demand, ...data, plaintiffId: data.plaintiff.id as number }, id);
			await this.db('demands').where({ id }).update(convertDataValues(demandToUpdate));

			await this.userLogService.create(getUserLogData(req, 'demands', id, 'atualizar'));
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
			return this.getDemands(options);
		} catch (err) {
			return err;
		}
	}

	async disabled(id: number, tenancyId: number, req: Request) {
		try {
			const data = (await this.getDemand(id)) as DemandViewModel;
			existsOrError(data.id, { message: 'Denand not found', status: NOT_FOUND });
			equalsOrError(data.tenancyId, tenancyId, { message: "User can't execute this action", status: FORBIDDEN });

			const toDesabled = new Demand({ ...data, plaintiffId: data.plaintiff.id as number, active: false } as IDemand);
			await this.db('demands').where({ id }).update(convertDataValues(toDesabled));

			await this.userLogService.create(getUserLogData(req, 'demands', id, 'desabilitar'));
			return { message: 'Demand disabled successfully', data: { ...data, active: false } };
		} catch (err) {
			return err;
		}
	}

	async getDemands(options: ReadOptionsModel) {
		try {
			const { tenancyId: tenancy_id, order, orderBy } = options;
			const fromDB = await this.db({ d: 'demands', p: 'plaintiffs', a: 'adresses', u: 'users' })
				.select(
					{
						id: 'd.id',
						name: 'd.name',
						favorite: 'd.favorite',
						level: 'd.level',
						description: 'd.description',
						approximate_income: 'd.approximate_income',
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

			existsOrError(Array.isArray(fromDB), { message: 'Internal error', err: fromDB, status: INTERNAL_SERVER_ERROR });
			const raw = fromDB.map(item => convertDataValues(item, 'camel'));
			onLog('raw demands', raw);
			const demands: any[] = [];

			for (const item of raw) {
				item.description = convertBlobToString(item.description);
				item.approximateIncome = setValueNumberToView(item.approximateIncome) as number;
				item.favorite = !!item.favorite;
				const keywords = await this.getKeywords(item.id);
				const task = await this.setTasksperDemands(item.id);

				demands.push({ ...item, keywords, task });
			}

			return demands;
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
						approximate_income: 'd.approximate_income',
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

	async favorite(id: number, req: Request) {
		return super
			.favoriteItem('demands', id)
			.then(async res => {
				await this.userLogService.create(getUserLogData(req, 'demands', id, 'desabilitar'));

				return res;
			})
			.catch(err => err);
	}

	private async getKeywords(demandId: number) {
		try {
			const keysIds = await this.db('demands_keywords').select('keyword_id as id').where('demand_id', demandId);
			existsOrError(Array.isArray(keysIds), { message: 'Internal error', err: keysIds, status: INTERNAL_SERVER_ERROR });
			const ids = keysIds.map(({ id }) => id);

			if (!ids?.length) return [];
			const res: any[] = [];

			for (const id of ids) {
				const fromDB = await this.db('keywords').select('keyword').where({ id }).first();
				const { keyword } = fromDB;

				existsOrError(keyword, { message: 'Internal error', err: fromDB, status: INTERNAL_SERVER_ERROR });
				res.push(keyword);
			}

			return res;
		} catch (err) {
			return err;
		}
	}

	private async setTasksperDemands(demandId: number) {
		try {
			const fromDB = await this.db('tasks').select('id', 'title').where('demand_id', demandId);
			existsOrError(Array.isArray(fromDB), { message: 'Internal error', err: fromDB, status: INTERNAL_SERVER_ERROR });

			return fromDB.map(i => convertDataValues(i, 'camel'));
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
			const fromDB = await this.db('plaintiffs').where({ cpf_cnpj: value.cpfCnpj }).andWhere({ tenancy_id: value.tenancyId }).first();
			if (fromDB?.id) return Number(fromDB?.id);

			const data = new Plaintiff({ ...value } as IPlantiff);
			const { email, phone, address } = value;
			const [id] = await this.db('plaintiffs').insert(convertDataValues({ ...data, active: true }));
			existsOrError(Number(id), { message: 'Internal error', err: id, status: INTERNAL_SERVER_ERROR });

			const [contactId] = await this.db('contacts').insert(
				convertDataValues({ email, phone, tenancyId: value.tenancyId, plaintiffId: id })
			);
			existsOrError(Number(contactId), {
				message: 'Internal Error on save Contact',
				err: contactId,
				status: INTERNAL_SERVER_ERROR,
			});

			const [addressId] = await this.db('adresses').insert(convertDataValues({ ...address, plaintiffId: id }));
			existsOrError(Number(addressId), {
				message: 'Internal error on save Plaintiff Adress',
				err: addressId,
				status: INTERNAL_SERVER_ERROR,
			});

			return Number(id);
		} catch (err) {
			return err;
		}
	}
}
