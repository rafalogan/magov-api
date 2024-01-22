import { FORBIDDEN, NOT_FOUND } from 'http-status';
import { onLog } from 'src/core/handlers';

import { Rule } from 'src/repositories/entities';
import { IServiceOptions } from 'src/repositories/types';
import { convertDataValues } from 'src/utils';
import { DatabaseService } from './abistract-database.service';

export class RuleService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: Rule) {
		try {
			const fromDb = (await this.getRule(data.name)) as Rule;

			if (fromDb.id) throw { message: 'Rule already exists', status: FORBIDDEN };

			const [id] = await this.db('rules').insert(convertDataValues(data));
			return { message: 'Rule saved successfully', data: { ...data, id } };
		} catch (err) {
			return err;
		}
	}

	async update(data: Rule, id: number) {
		try {
			const fromDB = (await this.getRule(id)) as Rule;

			if (!fromDB.id) throw { message: 'Rule not found', status: NOT_FOUND };
			const rule = new Rule({ ...fromDB, ...data });

			await this.db('rules').where({ id }).update(convertDataValues(rule));

			return { message: 'Rule updated successfully', data: rule };
		} catch (err) {
			return err;
		}
	}

	async read(id?: number | string) {
		if (id) return this.getRule(id);

		return this.db('rules')
			.then(res => res.map(r => new Rule(convertDataValues(r, 'camel'))))
			.catch(err => err);
	}

	async getRule(value: number | string) {
		try {
			const fromDB = Number(value)
				? await this.db('rules').where({ id: value }).first()
				: await this.db('rules').where({ name: value }).first();

			if (!fromDB?.id) throw { message: 'Rule not found', status: NOT_FOUND };

			return new Rule(convertDataValues(fromDB, 'camel'));
		} catch (err) {
			return err;
		}
	}

	async delete(id: number | string) {
		try {
			const fromDB = (await this.getRule(id)) as Rule;

			onLog('element from delete', fromDB);

			if (!fromDB?.id) throw { message: 'Rule not found', status: NOT_FOUND };

			const rulesUsersIds = await this.db('users_rules').where({ rule_id: fromDB.id });
			if (rulesUsersIds.length !== 0) await this.db('users_rules').where({ rules_id: fromDB.id }).del();

			await this.db('rules').where({ id: fromDB.id }).del();
			return { message: 'Rule deleted successfull', data: fromDB };
		} catch (err) {
			return err;
		}
	}
}
