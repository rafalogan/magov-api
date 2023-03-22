import { FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';
import { onLog } from 'src/core/handlers';
import { Address, FileEntity, Tenancy, User } from 'src/repositories/entities';
import { ReadOptionsModel, UserModel, UserViewModel } from 'src/repositories/models';
import { IAddress, IServiceOptions, ITenancy, IUnitPlan, IUser, IUserViewModel } from 'src/repositories/types';
import { convertDataValues, deleteField, existsOrError, notExistisOrError } from 'src/utils';
import { DatabaseService } from './abistract-database.service';
import { UnitService } from './unit.service';

export class UserService extends DatabaseService {
	constructor(options: IServiceOptions, private unitService: UnitService) {
		super(options);
	}

	async create(data: UserModel) {
		try {
			onLog('data to Save', data);
			const fromDB = (await this.getUser(data.email)) as UserViewModel;

			notExistisOrError(fromDB?.id, fromDB);

			const tenancyId = data.plans || data.tenancyId ? await this.setTenancy(data.tenancyId) : undefined;
			existsOrError(Number(tenancyId), { message: 'Internal error', error: tenancyId, status: INTERNAL_SERVER_ERROR });

			if (data.plans?.length) await this.setTenancyPlans(data.plans, Number(tenancyId));

			const toSave = new User({ ...data, tenancyId } as IUser);
			const [userId] = await this.db('users').insert(convertDataValues(toSave));
			existsOrError(Number(userId), { messages: 'Internal', error: userId, status: INTERNAL_SERVER_ERROR });

			await this.saveAddress(data.address, userId);
			if (data.userRules?.length) await this.saveUserRules(data.userRules, userId);
			if (data.image) await this.setUserImage(data.image, userId);
			const unit = data.unit ? await this.unitService.save(data.unit) : undefined;

			deleteField(data, 'password');

			return { message: 'User save with success', user: { ...data, tenancyId, id: userId, unit } };
		} catch (err) {
			return err;
		}
	}

	async read(options: ReadOptionsModel, id?: number) {
		return id ? this.getUser(id) : this.getUsers(options);
	}

	async update(data: UserModel, id: number): Promise<any> {
		try {
			const userFromDb = (await this.getUser(id)) as UserViewModel;

			existsOrError(userFromDb?.id, userFromDb);
			const user = new User({ ...userFromDb, ...data, tenancyId: userFromDb.tenancyId } as IUser);

			if (data.userRules) await this.userRulesUpdate(data.userRules, id);
			if (data.image) await this.setUserImage(data.image, id);
			if (data.address) await this.saveAddress(data.address, id);

			await this.db('users')
				.where({ id })
				.update({ ...convertDataValues(user) });

			const res = { ...userFromDb, ...data };
			deleteField(res, 'password');

			return { message: 'User update with success', data: res };
		} catch (err) {
			return err;
		}
	}

	async getUsers(options: ReadOptionsModel) {
		try {
			const users = options?.tenancyId ? await this.findAllByTenacy('users', options) : await this.findAll('users', options);
			onLog('users', users);
			const data = users.data?.map((user: any) => {
				deleteField(user, 'password');
				user.active = !!user.active;
				return user;
			});

			return { ...users, data };
		} catch (err) {
			return err;
		}
	}

	async getUser(filter: number | string) {
		try {
			const fromDb =
				typeof filter === 'number'
					? await this.db({ u: 'users', a: 'adresses' })
							.select(
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
								}
							)
							.where('u.id', filter)
							.andWhereRaw('a.user_id = u.id')
							.first()
					: await this.db({ u: 'users', a: 'adresses' })
							.select(
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
								},
								{
									cep: 'a.cep',
									street: 'a.street',
									number: 'a.number',
									complement: 'a.complement',
									district: 'a.district',
									city: 'a.city',
									uf: 'a.uf',
								}
							)
							.where('u.email', filter)
							.andWhereRaw('a.user_id = u.id')
							.first();

			existsOrError(fromDb?.id, { message: 'User not found', status: NOT_FOUND });
			const raw = convertDataValues(fromDb, 'camel');
			const { id } = raw;
			onLog('raw', raw);

			const unitAndPlan: any = await this.getUnitAndPlan(raw.unitId);

			onLog('unit and plan', unitAndPlan);
			const rules = await this.getValues({
				tableIds: 'users_rules',
				fieldIds: 'rule_id',
				whereIds: 'user_id',
				value: id,
				table: 'rules',
				fields: ['id', 'name'],
			});

			const image = await this.getflie(id);

			const plans = !raw.unitId
				? await this.getValues({
						tableIds: 'tenancies_plans',
						fieldIds: 'plan_id',
						whereIds: 'tenancy_id',
						value: raw.tenancyId,
						table: 'plans',
						fields: ['id', 'name'],
				  })
				: undefined;

			return new UserViewModel({
				...raw,
				...unitAndPlan,
				rules,
				address: { ...raw },
				image,
				plans,
			} as IUserViewModel);
		} catch (err) {
			return err;
		}
	}

	async remove(id: number) {
		try {
			const userFromDb = (await this.db('users').where({ id }).first()) as IUser;
			if (userFromDb) {
				const user = new User({ ...userFromDb, active: false });

				await this.db('users')
					.where({ id })
					.update({ ...convertDataValues(user) });
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

	private async getflie(id: number) {
		try {
			const fromDB = await this.db('files').select('title', 'alt', 'name', 'filename', 'type', 'url').where('user_id', id).first();

			if (!fromDB?.url) return {};
			return { ...convertDataValues(fromDB, 'camel') };
		} catch (err) {
			return err;
		}
	}

	private async getUnitAndPlan(id?: number) {
		try {
			if (!id) return { unit: {}, plan: {} };

			const fromDB = await this.db({ u: 'units', p: 'plans' })
				.select({ unit_id: 'u.id', unit_name: 'u.name' }, { plan_id: 'p.id', plan_name: 'p.name' })
				.where('u.id', id)
				.whereRaw('p.id = u.plan_id')
				.first();
			const raw = convertDataValues(fromDB, 'camel');

			return { unit: { id: raw.unitId, name: raw.unitName }, plan: { id: raw.planId, name: raw.planName } };
		} catch (err) {
			return err;
		}
	}

	private async setTenancy(id?: number) {
		try {
			if (Number(id)) {
				const plans = (await this.getPlansBytenancy(id as number)) as any[];
				existsOrError(Array.isArray(plans), plans);

				const fromDB = await this.db('tenancies').where({ id }).first();
				existsOrError(fromDB?.id, { message: 'Internal error', err: fromDB, status: INTERNAL_SERVER_ERROR });
				const raw = convertDataValues(fromDB, 'camel');

				const userLimit = plans.map(i => i.limit).reduce((total, limit) => total + limit, 0);
				existsOrError(raw.totalUsers < userLimit, { message: 'User limit reached', status: FORBIDDEN });
				await this.db('tenancies')
					.where({ id })
					.update(convertDataValues(new Tenancy({ ...raw, totalUsers: raw.totalUsers + 1 })));
				return Number(id);
			}

			const tenancy = new Tenancy({ totalUsers: 1, active: true } as ITenancy);
			const [tenancyId] = await this.db('tenancies').insert(convertDataValues(tenancy));

			existsOrError(Number(tenancyId), { message: 'Internal error', error: tenancyId, status: INTERNAL_SERVER_ERROR });

			return tenancyId;
		} catch (err) {
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

	private async setTenancyPlans(plans: IUnitPlan[], tenancyId: number) {
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

	private async saveUserRules(data: number[], userId: number) {
		try {
			for (const id of data) {
				const rule = await this.db('rules').where({ id }).first();

				if (rule) await this.db('users_rules').insert({ user_id: userId, rule_id: id }).first();
			}
		} catch (err) {
			return err;
		}
	}

	private async userRulesUpdate(data: number[], userId: number) {
		try {
			await this.db('users_rules').where({ user_id: userId }).delete();
			await this.saveUserRules(data, userId);
		} catch (err) {
			return err;
		}
	}

	private async setUserImage(file: FileEntity, userId: number) {
		try {
			const fileFromDb = await this.db('files').where({ user_id: userId }).first();
			if (fileFromDb) {
				await this.db('files')
					.where({ user_id: userId })
					.update(convertDataValues({ ...file, userId }));
				return file;
			}

			await this.db('files').insert(convertDataValues({ ...file, userId }));
			return file;
		} catch (err) {
			return err;
		}
	}
}
