import { Request } from 'express';
import { FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';

import { getUserLogData, onError, onLog } from 'src/core/handlers';
import { Address, FileEntity, Tenancy, User } from 'src/repositories/entities';
import { PaginationModel, ReadOptionsModel, UnitModel, UserModel, UserViewModel } from 'src/repositories/models';
import { IAddress, IServiceOptions, ITenancy, IUnitProduct, IUser, IUserRule, IUserRuleView, IUserViewModel } from 'src/repositories/types';
import { convertDataValues, deleteField, deleteFile, existsOrError, notExistisOrError } from 'src/utils';
import { DatabaseService } from './abistract-database.service';
import { UnitService } from './unit.service';

export class UserService extends DatabaseService {
	constructor(
		options: IServiceOptions,
		private unitService: UnitService
	) {
		super(options);
	}

	async create(data: UserModel, req: Request) {
		try {
			const fromDB = (await this.getUser(data.email)) as any;
			notExistisOrError(fromDB?.id, { message: 'User already exists', status: FORBIDDEN });
			notExistisOrError(fromDB?.err, fromDB);

			if (data?.newTenancy) return this.setMasterUserTenancy(data, req);
			if (data?.tenancyId && data.unitId) return this.setUserUnit(data, req);

			return this.setMasterUser(data);
		} catch (err) {
			return err;
		}
	}

	async read(options: ReadOptionsModel, id?: number) {
		if (id) return this.getUser(id);
		if (options?.tenancyId) return options.unitId ? this.getUsersByUnit(options) : this.getUsers(options);

		const tables = { u: 'users', un: 'units' };
		const fields = [
			{
				id: 'u.id',
				first_name: 'u.first_name',
				last_name: 'u.last_name',
				office: 'u.office',
				email: 'u.email',
				cpf: 'u.cpf',
				phone: 'u.phone',
				level: 'u.level',
				active: 'u.active',
				tenancy_id: 'u.tenancy_id',
			},
			{ unit_id: 'un.id', unit_name: 'un.name' },
		];

		const fromDB = await this.db(tables)
			.select(...fields)
			.whereRaw('un.id = u.unit_id');

		existsOrError(Array.isArray(fromDB), { message: 'Internal error', err: fromDB, status: INTERNAL_SERVER_ERROR });

		return fromDB.map(i => convertDataValues(i, 'camel'));
	}

	async update(data: UserModel, id: number, req: Request): Promise<any> {
		try {
			const userFromDb = (await this.getUser(id)) as UserViewModel;

			existsOrError(userFromDb?.id, userFromDb);
			const user = new User({ ...userFromDb, ...data, tenancyId: userFromDb.tenancyId } as IUser);

			if (data.userRules) await this.userRulesUpdate(data.userRules, id);
			const image = data.image ? await this.setUserImage(data.image, id) : undefined;
			if (data.address) await this.saveAddress(data.address, id);

			await this.db('users')
				.where({ id })
				.update({ ...convertDataValues(user) });

			const res = { ...userFromDb, ...data, image };
			deleteField(res, 'password');

			await this.userLogService.create(getUserLogData(req, 'users', id, 'atualizar'));

			return { message: 'User update with success', data: res };
		} catch (err) {
			return err;
		}
	}

	async getUsersByUnit(options: ReadOptionsModel) {
		try {
			const { page, limit, unitId, tenancyId, orderBy, order } = options;
			const total = await this.getCount('users', tenancyId);
			const tables = { u: 'users', un: 'units' };
			const fields = [
				{
					id: 'u.id',
					first_name: 'u.first_name',
					last_name: 'u.last_name',
					office: 'u.office',
					email: 'u.email',
					cpf: 'u.cpf',
					phone: 'u.phone',
					level: 'u.level',
					active: 'u.active',
					tenancy_id: 'u.tenancy_id',
				},
				{ unit_id: 'un.id', unit_name: 'un.name' },
			];

			if (page) {
				const pagination = new PaginationModel({ page, limit, total });
				const fromDB = await this.db(tables)
					.select(...fields)
					.where('u.unit_id', unitId)
					.andWhere('u.tenancy_id', tenancyId)
					.andWhereRaw('un.id = u.unit_id')
					.limit(limit)
					.offset(page * limit - limit)
					.orderBy(orderBy || 'id', order || 'asc');

				existsOrError(Array.isArray(fromDB), { message: 'Internal error', err: fromDB, status: INTERNAL_SERVER_ERROR });

				const data = fromDB.map(i => {
					deleteField(i, 'password');
					i.active = !!i.active;
					return convertDataValues(i, 'camel');
				});
				return { data, pagination };
			}

			const fromDB = await this.db(tables)
				.select(...fields)
				.where('u.unit_id', unitId)
				.andWhere('u.tenancy_id', tenancyId)
				.andWhereRaw('un.id = u.unit_id')
				.orderBy(orderBy || 'id', order || 'asc');

			existsOrError(Array.isArray(fromDB), { message: 'Internal error', err: fromDB, status: INTERNAL_SERVER_ERROR });

			return fromDB.map(i => convertDataValues(i, 'camel'));
		} catch (err) {
			return err;
		}
	}

	async getUsers(options: ReadOptionsModel) {
		try {
			const tables = { u: 'users', un: 'units' };
			const fields = [
				{
					id: 'u.id',
					first_name: 'u.first_name',
					last_name: 'u.last_name',
					office: 'u.office',
					email: 'u.email',
					cpf: 'u.cpf',
					phone: 'u.phone',
					level: 'u.level',
					active: 'u.active',
					tenancy_id: 'u.tenancy_id',
				},
				{ unit_id: 'un.id', unit_name: 'un.name' },
			];

			const fromDB = await this.db(tables)
				.select(...fields)
				.andWhere('u.tenancy_id', options.tenancyId)
				.andWhereRaw('un.id = u.unit_id');

			existsOrError(Array.isArray(fromDB), { message: 'Internal error', err: fromDB, status: INTERNAL_SERVER_ERROR });

			return fromDB.map(i => convertDataValues(i, 'camel'));
		} catch (err) {
			return err;
		}
	}

	async getUser(filter: number | string) {
		try {
			const fields = [
				{
					id: 'u.id',
					first_name: 'u.first_name',
					last_name: 'u.last_name',
					office: 'u.office',
					email: 'u.email',
					password: 'u.password',
					cpf: 'u.cpf',
					phone: 'u.phone',
					active: 'u.active',
					level: 'u.level',
					tenancy_id: 'u.tenancy_id',
					unit_id: 'u.unit_id',
				},
				{
					cep: 'a.cep',
					street: 'a.street',
					number: 'a.number',
					complement: 'a.complement',
					district: 'a.district',
					city: 'a.city',
					uf: 'a.uf',
				},
			];
			const tables = { u: 'users', a: 'adresses' };
			const fromDb =
				typeof filter === 'number'
					? await this.db(tables)
							.select(...fields)
							.where('u.id', filter)
							.andWhereRaw('a.user_id = u.id')
							.first()
					: await this.db(tables)
							.select(...fields)
							.where('u.email', filter)
							.andWhereRaw('a.user_id = u.id')
							.first();

			existsOrError(fromDb, { message: 'User not found', status: NOT_FOUND });
			notExistisOrError(fromDb.severity === 'ERROR', {
				message: 'Internal error',
				status: INTERNAL_SERVER_ERROR,
				err: fromDb,
			});

			const raw = convertDataValues(fromDb, 'camel');
			const { id } = raw;

			const unit = await this.getUnit(raw.unitId);
			const userRules = await this.getUserRules(id);
			const image = await this.getflie(id);
			const plans = await this.getPlans(raw.tenancyId, raw.unitId);
			onLog('user image', image);

			return new UserViewModel({
				...raw,
				...unit,
				userRules,
				address: { ...raw },
				image,
				plans,
			} as IUserViewModel);
		} catch (err) {
			return err;
		}
	}

	async remove(id: number, req: Request) {
		try {
			const userFromDb = (await this.db('users').where({ id }).first()) as IUser;
			if (userFromDb) {
				const user = new User({ ...userFromDb, active: false });

				await this.db('users')
					.where({ id })
					.update({ ...convertDataValues(user) });

				await this.userLogService.create(getUserLogData(req, 'users', id, 'desabilitar'));

				return {
					message: 'User disabled with success',
					user: { id: user.id, email: user.email, active: !!user.active },
				};
			}

			return { message: 'User not found' };
		} catch (err) {
			return err;
		}
	}

	async setTenancy(tenancyId?: number, rawPlans?: IUnitProduct[]) {
		try {
			if (!tenancyId) {
				const tenancy = new Tenancy({ totalUsers: 1, active: true } as ITenancy);
				const [id] = await this.db('tenancies').insert(convertDataValues(tenancy));
				existsOrError(Number(id), { message: 'Internal error', err: id, status: INTERNAL_SERVER_ERROR });

				if (rawPlans?.length) await this.setTenancyPlans(rawPlans, id);

				return id;
			}

			if (rawPlans?.length) await this.setTenancyPlans(rawPlans, tenancyId);

			const plans = (await this.getPlansBytenancy(tenancyId as number)) as any[];
			existsOrError(Array.isArray(plans), plans);

			const fromDB = await this.db('tenancies').where({ id: tenancyId }).first();
			existsOrError(fromDB?.id, { message: 'Internal error', err: fromDB, status: INTERNAL_SERVER_ERROR });
			const raw = convertDataValues(fromDB, 'camel');

			const userLimit = plans.map(i => i.limit).reduce((total, limit) => total + limit, 0);
			existsOrError(raw.totalUsers < userLimit, { message: 'User limit reached', status: FORBIDDEN });

			await this.db('tenancies')
				.where({ id: tenancyId })
				.update(convertDataValues(new Tenancy({ ...raw, totalUsers: raw.totalUsers + 1 })));
			return Number(tenancyId);
		} catch (err) {
			return err;
		}
	}

	private async getUserRules(userId: number) {
		try {
			const rulesUsersDB = await this.db('users_rules').where('user_id', userId);
			const res: IUserRuleView[] = [];

			for (const item of rulesUsersDB) {
				const fromDB = await this.db({ s: 'app_screens', r: 'rules' })
					.select({ screen_id: 's.id', screen_name: 's.name' }, { rule_id: 'r.id', rule_name: 'r.name' })
					.where('s.id', item.screen_id)
					.andWhere('r.id', item.rule_id)
					.first();

				if (fromDB?.screen_id) res.push(convertDataValues(fromDB, 'camel'));
			}

			return res;
		} catch (err) {
			return err;
		}
	}

	private async setMasterUserTenancy(data: UserModel, req: Request) {
		try {
			const tenancyId = await this.setTenancy(data?.tenancyId, data?.plans);
			const unit = data?.unit
				? await this.setUnit(
						req,
						new UnitModel({
							...data.unit,
							active: true,
							tenancyId: Number(tenancyId),
						})
				  )
				: undefined;

			existsOrError(Number(tenancyId), { message: 'Internl error', err: tenancyId, status: INTERNAL_SERVER_ERROR });

			const toSave = new User({ ...data, tenancyId: Number(tenancyId), unitId: Number(unit.id) || undefined });
			const [id] = await this.db('users').insert(convertDataValues(toSave));

			existsOrError(Number(id), { message: 'Internl error', err: id, status: INTERNAL_SERVER_ERROR });

			if (data.userRules?.length) await this.saveUserRules(data.userRules, id);
			if (data.image) await this.setUserImage(data.image, id);

			const address = await this.setAddress(data.address, 'userId', id);
			await this.userLogService.create(getUserLogData(req, 'users', id, 'salvar'));

			deleteField(data, 'password');

			return { message: 'User successful saved', user: { ...data, id, tenancyId, unit, address } };
		} catch (err) {
			return err;
		}
	}

	private async setUnit(req: Request, data?: UnitModel) {
		try {
			if (!data) return undefined;

			const action = (await this.unitService.create(data, req)) as any;

			existsOrError(action?.unit, action);

			return action?.unit;
		} catch (err: any) {
			onError('error to setUnit', err);
			return err;
		}
	}

	private async setUserUnit(data: UserModel, req: Request) {
		try {
			const tenancyId = await this.setTenancy(data.tenancyId);
			existsOrError(Number(tenancyId), { message: 'Internl error', err: tenancyId, status: INTERNAL_SERVER_ERROR });

			const toSave = new User({ ...data, tenancyId: Number(tenancyId) });
			const [id] = await this.db('users').insert(convertDataValues(toSave));

			existsOrError(Number(id), { message: 'internl error', err: id, status: INTERNAL_SERVER_ERROR });

			if (data?.userRules.length) await this.saveUserRules(data.userRules, id);
			if (data?.image) await this.setUserImage(data.image, id);
			const address = await this.setAddress(data.address, 'userId', id);

			deleteField(data, 'password');

			await this.userLogService.create(getUserLogData(req, 'users', id, 'salvar'));

			return { message: 'User successful saved', user: { ...data, id, tenancyId, address } };
		} catch (err) {
			return err;
		}
	}

	private async setMasterUser(data: UserModel) {
		try {
			const toSave = new User({ ...data, tenancyId: undefined });
			const [id] = await this.db('users').insert(convertDataValues(toSave));

			if (data.userRules?.length) await this.saveUserRules(data.userRules, id);
			if (data.image) await this.setUserImage(data.image, id);

			deleteField(data, 'password');

			return { message: 'User successful saved', user: { ...data, id } };
		} catch (err) {
			return err;
		}
	}

	private async getflie(id: number) {
		try {
			const fromDB = await this.db('files').select('title', 'alt', 'name', 'filename', 'type', 'url').where('user_id', id).first();

			if (!fromDB?.url) return {};
			return { ...convertDataValues(fromDB, 'camel') };
		} catch (err) {
			return err;
		}
	}

	private async getUnit(id?: number) {
		try {
			if (!id) return {};

			const fromDB = await this.db('units').select('id', 'name').where({ id }).first();

			return convertDataValues(fromDB, 'camel');
		} catch (err) {
			onError('erro on get unit', err);
			return err;
		}
	}

	private async getPlansBytenancy(tenancyId: number) {
		try {
			const fromDB = await this.db({ tp: 'tenancies_plans', p: 'products' })
				.select({ amount: 'tp.amount' }, { id: 'p.id', name: 'p.name', limit: 'p.limit' })
				.where('tp.tenancy_id', tenancyId)
				.andWhereRaw('p.id = tp.plan_id')
				.andWhereRaw('p.plan = 1');

			existsOrError(Array.isArray(fromDB), { message: 'Internal error', error: fromDB, status: INTERNAL_SERVER_ERROR });

			return fromDB.map(i => convertDataValues(i, 'camel'));
		} catch (err) {
			return err;
		}
	}

	private async setTenancyPlans(plans: IUnitProduct[], tenancyId: number) {
		try {
			for (const plan of plans) {
				onLog('plan to save', plan);
				const fromDB = await this.db('tenancies_plans').where('plan_id', plan.id).andWhere('tenancy_id', tenancyId).first();

				onLog('from DB tenancies_plans', fromDB);
				if (!fromDB?.plan_id) {
					onLog('toSave plan', convertDataValues({ planId: plan.id, tenancyId, amount: plan.amount }));
					await this.db('tenancies_plans').insert(convertDataValues({ planId: plan.id, tenancyId, amount: plan.amount }));
				} else {
					const amount = fromDB.amount !== plan.amount ? plan.amount : fromDB.amount;
					await this.db('tenancies_plans').insert(convertDataValues({ planId: plan.id, tenancyId, amount }));
				}
			}
		} catch (err) {
			return err;
		}
	}

	private async saveAddress(address: Address, userId: number) {
		try {
			const fromDb = await this.db('adresses').where({ user_id: userId }).first();
			onLog('adress from db', fromDb);

			const data = fromDb ? new Address({ ...fromDb, ...address } as IAddress) : new Address({ ...address } as IAddress);
			onLog('data to save', data);

			if (!fromDb) {
				const [id] = await this.db('adresses').insert(convertDataValues({ ...data, userId }));
				const res = { ...data, id };
				return res;
			}
			await this.db('adresses').where({ user_id: userId }).update(convertDataValues(data));
			return data;
		} catch (err) {
			return err;
		}
	}

	private async saveUserRules(data: IUserRule[], userId: number) {
		try {
			for (const item of data) {
				const screenDB = await this.db('rules').where('id', item.screenId).first();
				const rule = await this.db('rules').where('id', item.ruleId).first();

				if (rule?.id && screenDB?.id) {
					await this.db('users_rules').insert(convertDataValues({ ...item, userId }));
				}
			}
		} catch (err) {
			return err;
		}
	}

	private async userRulesUpdate(data: IUserRule[], userId: number) {
		try {
			await this.db('users_rules').where({ user_id: userId }).delete();
			await this.saveUserRules(data, userId);
		} catch (err) {
			return err;
		}
	}

	private async setUserImage(file: FileEntity, userId: number) {
		try {
			const fileFromDb = await this.db('files').where('user_id', userId).first();

			if (fileFromDb?.filename) {
				await deleteFile(fileFromDb.filename);
				await this.db('files').where('user_id', userId).del();
			}

			await this.db('files').insert(convertDataValues({ ...file, userId }));
			return file;
		} catch (err) {
			return err;
		}
	}

	private async getPlans(tenancyId?: number, unitId?: number) {
		try {
			if (!unitId && !tenancyId) return [];

			if (Number(unitId)) {
				return this.getPlansByUnit(Number(unitId));
			}

			return this.getPlansBytenancy(Number(tenancyId));
		} catch (err: any) {
			return err;
		}
	}

	private async getPlansByUnit(unitId: number) {
		try {
			const fromDB = await this.db({ up: 'units_products', p: 'products' })
				.select({ amount: 'up.amount' }, { id: 'p.id', name: 'p.name', limit: 'p.limit' })
				.where('up.unit_id', unitId)
				.andWhereRaw('p.id = up.product_id');

			existsOrError(Array.isArray(fromDB), fromDB);

			return fromDB.map(i => convertDataValues(i, 'camel'));
		} catch (err: any) {
			onError('erro on get plans by unit', err);
			return err;
		}
	}
}
