import { type } from 'os';
import { Address, FileEntity, Tenancy, User } from 'src/repositories/entities';
import { ReadOptionsModel, UserModel, UserViewModel } from 'src/repositories/models';
import { IAddress, IServiceOptions, ITenacy, IUser, IUserViewModel } from 'src/repositories/types';
import { convertDataValues, deleteField } from 'src/utils';
import { DatabaseService } from './abistract-database.service';

export class UserService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: UserModel): Promise<any> {
		try {
			const tenancyId = data.planId ? await this.createTenancy(data.planId) : data.tenancyId;
			const [userId] = await this.db('users').insert(convertDataValues({ ...new User({ ...data, tenancyId } as IUser) }));

			if (data.userRules?.length) await this.saveUserRules(data.userRules, userId);
			if (data.image) await this.setUserImage(data.image, userId);

			await this.saveAddress(data.address, userId);
			deleteField(data, 'password');

			return { message: 'User save with success', user: data };
		} catch (err) {
			return err;
		}
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

	getUsers(options: ReadOptionsModel) {
		if (options?.tenancyId) return this.findAllByTenacy('users', options);
		return this.findAll('users', options);
	}

	async getUser(filter: number | string) {
		try {
			const user =
				typeof filter === 'number'
					? convertDataValues(await this.db('user').where({ id: filter }).first(), 'camel')
					: convertDataValues(await this.db('user').where({ email: filter }).first(), 'camel');

			if (!user) return {};

			const { id } = user;
			const unit = await this.db('units').select('id', 'name').where({ id: user.unitId }).first();
			const rulesIds = await this.db('users_rules').select('rule_id as ruleId').where({ user_id: id });
			const rules = rulesIds?.length ? rulesIds.map(id => this.db('rules').select('id', 'name').where({ id }).first()) : [];
			const address = convertDataValues(await this.db('adresses').where({ user_id: id }).first(), 'camel');
			const image = convertDataValues(await this.db('files').where({ user_id: id }).first(), 'camel');

			deleteField(user, 'unitId');
			deleteField(user, 'password');

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
				return { message: 'User disabled with success', user };
			}

			return { message: 'User not found' };
		} catch (err) {
			return err;
		}
	}

	private async createTenancy(planId: number) {
		try {
			const tenacy = new Tenancy({ totalUsers: 1, active: true } as ITenacy);
			const [tenancyId] = await this.db('tenancies').insert({ ...tenacy });

			await this.db('tenancies_plans').insert({ plan_id: planId, tenacy_id: tenancyId });
			return tenancyId;
		} catch (err) {
			return err;
		}
	}

	private async saveAddress(address: Address, userId: number) {
		try {
			const fromDb = (await this.db('adresses').where({ user_id: userId }).first()) as IAddress;

			if (fromDb) {
				const data = new Address({ ...fromDb, ...address } as IAddress);
				await this.db('adresses').where({ user_id: userId }).update(convertDataValues(data));
				return data;
			}

			await this.db('adresses').insert(convertDataValues({ address, userId }));
			return address;
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
