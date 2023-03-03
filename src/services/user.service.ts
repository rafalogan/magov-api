import { onLog } from 'src/core/handlers';
import { Address, FileEntity, Tenancy, User } from 'src/repositories/entities';
import { ReadOptionsModel, UserModel, UserViewModel } from 'src/repositories/models';
import { IAddress, IServiceOptions, ITenancy, IUser, IUserViewModel } from 'src/repositories/types';
import { convertDataValues, deleteField } from 'src/utils';
import { DatabaseService } from './abistract-database.service';

export class UserService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: UserModel): Promise<any> {
		try {
			const tenancyId = data.planId ? await this.createTenancy(data.planId) : data.tenancyId;
			onLog('tenancyId', tenancyId);
			const [userId] = await this.db('users').insert(convertDataValues({ ...new User({ ...data, tenancyId } as IUser) }));

			if (data.address) await this.saveAddress(data.address, userId);
			if (data.userRules?.length) await this.saveUserRules(data.userRules, userId);
			if (data.image) await this.setUserImage(data.image, userId);

			deleteField(data, 'password');

			return { message: 'User save with success', user: { ...data, tenancyId } };
		} catch (err) {
			return err;
		}
	}

	async read(options: ReadOptionsModel, id?: number) {
		return id ? this.getUser(id) : this.getUsers(options);
	}

	async update(data: UserModel, id: number): Promise<any> {
		try {
			const userFromDb = await this.getUser(id);

			if (userFromDb) {
				if (data.userRules) await this.userRulesUpdate(data.userRules, id);
				if (data.image) await this.setUserImage(data.image, id);
				if (data.address) await this.saveAddress(data.address, id);

				const user = new User({ ...userFromDb, ...data } as IUser);

				await this.db('users')
					.where({ id })
					.update({ ...convertDataValues(user) });

				const res = { ...userFromDb, ...data };
				deleteField(res, 'password');

				return { message: 'User update with success', data: res };
			}

			return { message: 'User not found' };
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
			const user =
				typeof filter === 'number'
					? convertDataValues(await this.db('users').where({ id: filter }).first(), 'camel')
					: convertDataValues(await this.db('users').where({ email: filter }).first(), 'camel');

			if (!user) return {};

			const { id } = user;
			const unit = user.unitId ? await this.db('units').select('id', 'name').where({ id: user.unitId }).first() : {};
			const rulesIds = (await this.db('users_rules').select('rule_id as ruleId').where({ user_id: id })) || [];
			const rules = rulesIds?.length ? rulesIds.map(id => this.db('rules').select('id', 'name').where({ id }).first()) : [];
			const address = convertDataValues(await this.db('adresses').where({ user_id: id }).first(), 'camel') || {};
			const image = convertDataValues(await this.db('files').where({ user_id: id }).first(), 'camel');

			deleteField(user, 'unitId');
			return new UserViewModel({ ...user, unit, rules, address, image } as IUserViewModel);
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

	private async createTenancy(planId: number) {
		try {
			const tenacy = new Tenancy({ totalUsers: 1, active: true } as ITenancy);
			const [tenancyId] = await this.db('tenancies').insert(convertDataValues(tenacy));

			await this.db('tenancies_plans').insert({ plan_id: planId, tenancy_id: tenancyId });
			return tenancyId;
		} catch (err) {
			return err;
		}
	}

	private async saveAddress(address: Address, userId: number) {
		try {
			const fromDb = await this.db('adresses').where({ user_id: userId }).first();
			onLog('adress from db', fromDb);

			const data = fromDb ? new Address({ ...fromDb, ...address } as IAddress) : new Address({ ...address, userId } as IAddress);
			onLog('data to save', data);

			if (!fromDb) {
				const [id] = await this.db('adresses').insert(convertDataValues(data));
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
