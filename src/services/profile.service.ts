import { Request } from 'express';
import { BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';

import { IServiceOptions } from 'src/repositories/types';
import { DatabaseService } from './abistract-database.service';
import { ProfileModel } from 'src/repositories/models';
import { convertDataValues, existsOrError, notExistisOrError } from 'src/utils';
import { Profile, ProfileView } from 'src/repositories/entities';
import { getUserLogData, onLog } from 'src/core/handlers';

export class ProfileService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: ProfileModel, req: Request) {
		const fromDB = await this.db('profiles').where({ code: data.code.toUpperCase() }).first();
		notExistisOrError(fromDB, { message: 'Profile already exists', status: BAD_REQUEST });

		const profile = new Profile({ ...data, active: true });
		const [id] = await this.db('profiles').insert(convertDataValues(profile));

		await this.setProfileRules(id, data.rules);
		await this.userLogService.create(getUserLogData(req, 'create', id, 'profiles'));

		return { message: 'Profile created successfully', data: { ...profile, id } };
	}

	async update(data: ProfileModel, filter: number | string, req: Request) {
		const fromDB =
			typeof filter === 'number'
				? await this.db('profiles').where({ id: filter }).first()
				: await this.db('profiles').where({ code: filter.toUpperCase() }).first();

		existsOrError(fromDB, { message: 'Profile not found', status: NOT_FOUND });

		const profile = new Profile({ ...fromDB, ...data, active: !!data.active || !!fromDB.active }, fromDB.id);

		await this.db('profiles')
			.where(convertDataValues({ id: profile.id }))
			.update(convertDataValues(profile));

		if (data.rules.length) {
			await this.setProfileRules(Number(profile.id), data.rules);
		}

		await this.userLogService.create(getUserLogData(req, 'update', Number(profile.id), 'profiles'));

		return { message: 'Profile updated successfully', data: profile };
	}

	async read(filter?: number | string) {
		if (filter) return this.findOne(filter);

		return this.find();
	}

	async findOne(filter: number | string) {
		const fromDB = Number(filter)
			? await this.db('profiles').where({ id: filter }).first()
			: await this.db('profiles')
					.where({ code: String(filter).toUpperCase() })
					.first();

		onLog('profile from db:', fromDB);

		existsOrError(fromDB, { message: 'Profile not found', status: NOT_FOUND });

		const rules = await this.getProfileRules(Number(fromDB.id));

		return new ProfileView(convertDataValues({ ...fromDB, rules }, 'camel'));
	}

	async find() {
		return this.db('profiles')
			.then(res => res.map(profile => new Profile(profile)))
			.catch(err => ({ message: err.message, status: INTERNAL_SERVER_ERROR }));
	}

	async desactivate(filter: number | string, req: Request) {
		const fromDB = Number(filter)
			? await this.db('profiles').where({ id: filter }).first()
			: await this.db('profiles')
					.where({ code: String(filter).toUpperCase() })
					.first();

		existsOrError(fromDB, { message: 'Profile not found', status: NOT_FOUND });

		const profile = new Profile({ ...fromDB, active: false }, fromDB.id);

		await this.db('profiles')
			.where(convertDataValues({ id: profile.id }))
			.update(convertDataValues(profile));

		await this.userLogService.create(getUserLogData(req, 'desactivate', Number(profile.id), 'profiles'));

		return { message: 'Profile desactivated successfully', data: profile };
	}

	async delete(filter: number | string, req: Request) {
		const fromDB = Number(filter)
			? await this.db('profiles').where({ id: filter }).first()
			: await this.db('profiles')
					.where({ code: String(filter).toUpperCase() })
					.first();
		existsOrError(fromDB, { message: 'Profile already deleted', status: FORBIDDEN });

		const usersProfiles = await this.db('users').where({ level: fromDB.id });
		notExistisOrError(usersProfiles.length, { message: 'Profile has users', status: BAD_REQUEST });

		await this.db('profiles_rules')
			.where(convertDataValues({ profileId: fromDB.id }))
			.del();
		await this.db('profiles')
			.where(convertDataValues({ id: fromDB.id }))
			.del();

		await this.userLogService.create(getUserLogData(req, 'delete', Number(fromDB.id), 'profiles'));

		return { message: 'Profile deleted successfully', data: new Profile(convertDataValues(fromDB, 'camel')) };
	}

	private async getProfileRules(profileId: number) {
		const fromDB = await this.db({ pr: 'profiles_rules', r: 'rules' })
			.select({
				id: 'r.id',
				name: 'r.name',
				code: 'r.code',
				description: 'r.description',
			})
			.where('pr.profile_id', profileId)
			.andWhereRaw('pr.rule_id = r.id');

		existsOrError(Array.isArray(fromDB), { message: 'Internal Server Error', err: fromDB, status: INTERNAL_SERVER_ERROR });

		return fromDB.map((rule: any) => convertDataValues(rule, 'camel'));
	}

	private async setProfileRules(profileId: number, rules: Array<string | number>) {
		const profilesRules: any[] = [];
		await this.db('profiles_rules').where(convertDataValues({ profileId })).delete();

		for (const filter of rules) {
			const rule =
				typeof filter === 'number'
					? await this.db('rules').where({ id: filter }).first()
					: await this.db('rules').where({ code: filter.toUpperCase() }).first();

			if (rule) {
				profilesRules.push({ profile_id: profileId, rule_id: rule.id });
			}
		}

		await this.db.batchInsert('profiles_rules', profilesRules);
	}
}
