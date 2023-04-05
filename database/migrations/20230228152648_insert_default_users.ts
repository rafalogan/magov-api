import { Knex } from 'knex';

import { hashString } from 'src/utils';
import { defaultUsers } from '../defaults/users';

export async function up(knex: Knex): Promise<void> {
	const users = defaultUsers.map((user: any) => {
		user.password = hashString(user.password, Number(process.env.SALT_ROUNDS));
		return user;
	});

	return knex.batchInsert('users', users);
}

export async function down(knex: Knex): Promise<void> {
	return defaultUsers.forEach(({ email }) => knex('users').where({ email }).del());
}
