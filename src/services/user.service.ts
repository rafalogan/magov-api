import { Request } from 'express';
import { BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';

import { getUserLogData, onError, onLog } from 'src/core/handlers';
import { Address, FileEntity, Tenancy, User } from 'src/repositories/entities';
import { PaginationModel, ReadOptionsModel, RecoveryModel, UnitModel, UserModel, UserViewModel } from 'src/repositories/models';
import { IAddress, IProfile, IServiceOptions, ITenancy, IUnitProduct, IUser, IUserViewModel } from 'src/repositories/types';
import { convertDataValues, deleteField, deleteFile, existsOrError, hashString, notExistisOrError } from 'src/utils';
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
		if (options?.tenancyId) {
			return options.unitId ? this.getUsersByUnit(options) : this.getUsers(options);
		}

		const fromDB = await this.db({ u: 'users', p: 'profiles' })
			.select(
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
					unit_id: 'u.unit_id',
					tenancy_id: 'u.tenancy_id',
				},
				{ profile: 'p.name' }
			)
			.whereRaw('p.id = u.level');

		existsOrError(Array.isArray(fromDB), { message: 'Internal error', err: fromDB, status: INTERNAL_SERVER_ERROR });
		const res: any[] = [];

		for (const item of fromDB) {
			let unit = {};

			if (Number(item.unit_id)) {
				unit = await this.db('units').select('name as unit_name').where('id', item.unit_id).first();
			}

			res.push(convertDataValues({ ...item, ...unit }, 'camel'));
		}

		return res;
	}

	async update(data: UserModel, id: number, req: Request): Promise<any> {
		try {
			if (data?.unitId || data?.unit?.id) {
				const unitFromDB = await this.db('units').where('id', data.unitId).andWhere('tenancy_id', data.tenancyId).first();

				existsOrError(unitFromDB, { message: 'units not found', status: BAD_REQUEST });
				notExistisOrError(unitFromDB?.severity === 'ERROR', { message: 'intenal error', err: unitFromDB, status: INTERNAL_SERVER_ERROR });
			}

			const userFromDb = (await this.getUser(id)) as UserViewModel;

			existsOrError(userFromDb?.id, userFromDb);
			const user = new User({ ...userFromDb, ...data, tenancyId: userFromDb.tenancyId } as IUser);

			if (data.userRules) await this.setRules(id, data.userRules);
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

	async recoverPassword(data: RecoveryModel, req: Request) {
		try {
			const fromDB = await this.db('users').where('email', data.email).first();

			existsOrError(fromDB, { message: 'user not found', status: NOT_FOUND });
			notExistisOrError(fromDB?.severity === 'ERROR', { message: 'internal Server error', err: fromDB, status: INTERNAL_SERVER_ERROR });

			const password = hashString(data.password);

			await this.db('users').where('id', fromDB.id).update(convertDataValues({ password }));
			await this.userLogService.create(getUserLogData(req, 'users', fromDB.id, 'atualizar'));

			return { message: 'User successful recoved.' };
		} catch (err) {
			return err;
		}
	}

	async getUsersByUnit(options: ReadOptionsModel) {
		try {
			const { page, limit, unitId, tenancyId, orderBy, order } = options;
			const total = await this.getCount('users', tenancyId);
			const tables = { u: 'users', un: 'units', p: 'profiles' };
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
				{ profile: 'p.name' },
			];

			if (page) {
				const pagination = new PaginationModel({ page, limit, total });
				const fromDB = await this.db(tables)
					.select(...fields)
					.where('u.unit_id', unitId)
					.andWhere('u.tenancy_id', tenancyId)
					.andWhereRaw('un.id = u.unit_id')
					.andWhereRaw('p.id = u.level')
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
				.andWhereRaw('p.id = u.level')
				.orderBy(orderBy || 'id', order || 'asc');

			existsOrError(Array.isArray(fromDB), { message: 'Internal error', err: fromDB, status: INTERNAL_SERVER_ERROR });

			return fromDB.map(i => convertDataValues(i, 'camel'));
		} catch (err) {
			return err;
		}
	}

	async getUsers(options: ReadOptionsModel) {
		try {
			const tables = { u: 'users', un: 'units', p: 'profiles' };
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
				{ profile: 'p.name' },
			];

			const fromDB = await this.db(tables)
				.select(...fields)
				.andWhere('u.tenancy_id', options.tenancyId)
				.andWhereRaw('un.id = u.unit_id')
				.andWhereRaw('p.id = u.level');

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
				{
					profile_id: 'p.id',
					profile_name: 'p.name',
					profile_code: 'p.code',
					profile_description: 'p.description',
					profile_active: 'p.active',
				},
			];
			const tables = { u: 'users', a: 'adresses', p: 'profiles' };
			const fromDb =
				typeof filter === 'number'
					? await this.db(tables)
							.select(...fields)
							.where('u.id', filter)
							.andWhereRaw('a.user_id = u.id')
							.andWhereRaw('p.id = u.level')
							.first()
					: await this.db(tables)
							.select(...fields)
							.where('u.email', filter)
							.andWhereRaw('a.user_id = u.id')
							.andWhereRaw('p.id = u.level')
							.first();

			onLog('user from db', fromDb);

			existsOrError(fromDb, { message: 'User not found', status: NOT_FOUND });
			notExistisOrError(fromDb.severity === 'ERROR', {
				message: 'Internal error',
				status: INTERNAL_SERVER_ERROR,
				err: fromDb,
			});

			const raw = convertDataValues(fromDb, 'camel');
			const { id } = raw;
			onLog('user raw', raw);

			const unit = await this.getUnit(raw.unitId);
			const userRules = await this.getUserRules(id);
			const image = await this.getflie(id);
			const plans = await this.getPlans(raw.tenancyId, raw.unitId);
			const profile = await this.getProfile({
				id: raw.profileId,
				name: raw.profileName,
				code: raw.profileCode,
				description: raw.profileDescription,
				active: raw.profileActive,
			});
			onLog('user image', image);
			onLog('User unit id', unit);

			return new UserViewModel({
				...raw,
				unit,
				userRules,
				profile,
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

	private async setMasterUserTenancy(data: UserModel, req: Request) {
		try {
			const tenancyId = await this.setTenancy(data?.tenancyId, data?.plans);
			const unit = data?.unit
				? await this.setUnit(
						req,
						new UnitModel({
							...data.unit,
							phone: data?.unit.phone || data.phone,
							active: true,
							tenancyId: Number(tenancyId),
						})
					)
				: undefined;

			existsOrError(Number(tenancyId), { message: 'Internl error', err: tenancyId, status: INTERNAL_SERVER_ERROR });

			const masterTenancyPrifile = await this.db('profiles').where('code', 'MTENANCY').first();

			existsOrError(masterTenancyPrifile?.id, { message: 'Internal error', err: masterTenancyPrifile, status: INTERNAL_SERVER_ERROR });

			const toSave = new User({ ...data, tenancyId: Number(tenancyId), unitId: undefined, level: Number(masterTenancyPrifile?.id) });
			const [id] = await this.db('users').insert(convertDataValues(toSave));

			existsOrError(Number(id), { message: 'Internl error', err: id, status: INTERNAL_SERVER_ERROR });

			if (data.userRules?.length) await this.setRules(id, data.userRules);
			if (data.image) await this.setUserImage(data.image, id);

			const address = await this.setAddress(data.address, 'userId', id);
			await this.userLogService.create(getUserLogData(req, 'users', id, 'salvar'));

			deleteField(data, 'password');

			return { message: 'User successful saved', user: { ...data, id, tenancyId, unit, address } };
		} catch (err) {
			return err;
		}
	}

	private async setUnit(req: Request, data: UnitModel) {
		try {
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

			if (data?.unitId || data?.unit?.id) {
				const unitFromDB = await this.db('units').where('id', data.unitId).andWhere('tenancy_id', Number(tenancyId)).first();

				existsOrError(unitFromDB, { message: 'units not found', status: BAD_REQUEST });
				notExistisOrError(unitFromDB?.severity === 'ERROR', { message: 'intenal error', err: unitFromDB, status: INTERNAL_SERVER_ERROR });
			}

			const toSave = new User({ ...data, tenancyId: Number(tenancyId) });
			const [id] = await this.db('users').insert(convertDataValues(toSave));

			existsOrError(Number(id), { message: 'internl error', err: id, status: INTERNAL_SERVER_ERROR });

			if (data?.userRules.length) await this.setRules(id, data.userRules);
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

			if (data.userRules?.length) await this.setRules(id, data.userRules);
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
			const fromDB = await this.db({ tp: 'tenancies_plans', p: 'products', pt: 'products_types' })
				.select({ amount: 'tp.amount' }, { id: 'p.id', name: 'p.name', limit: 'p.limit' }, { type_id: 'pt.id', type: 'pt.type' })
				.where('tp.tenancy_id', tenancyId)
				.andWhereRaw('p.id = tp.plan_id')
				.andWhereRaw('pt.id = p.type_id');

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

	private async setRules(userId: number, rules: Array<string | number>) {
		try {
			await this.db('users_rules').where('user_id', userId).del();

			for (const item of rules) {
				const rule = Number(item) ? await this.db('rules').where('id', item).first() : await this.db('rules').where('code', item).first();

				if (rule?.id) {
					await this.db('users_rules').insert(convertDataValues({ userId, ruleId: rule.id }));
				}
			}
		} catch (err) {
			return err;
		}
	}

	private async getUserRules(userId: number) {
		try {
			const userRulesDB = await this.db({ ur: 'users_rules', r: 'rules' })
				.where('ur.user_id', userId)
				.andWhereRaw('r.id = ur.rule_id')
				.select({ id: 'r.id', name: 'r.name', code: 'r.code', description: 'r.description' });

			existsOrError(Array.isArray(userRulesDB), { message: 'Internal error', err: userRulesDB, status: INTERNAL_SERVER_ERROR });

			return userRulesDB?.map(i => convertDataValues(i, 'camel'));
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

	private async getProfile(data: IProfile) {
		try {
			const rules = await this.db({ pr: 'profiles_rules', r: 'rules' })
				.select({ id: 'r.id', name: 'r.name', code: 'r.code', description: 'r.description' })
				.where('pr.profile_id', data.id)
				.andWhereRaw('r.id = pr.rule_id');

			existsOrError(Array.isArray(rules), { message: 'Internal error', err: rules, status: INTERNAL_SERVER_ERROR });

			return { ...data, rules };
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
