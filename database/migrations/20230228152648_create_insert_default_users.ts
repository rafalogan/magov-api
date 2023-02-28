import { Knex } from 'knex';
import { hashString } from 'src/utils';
import * as DefaultUsers from '../defaults/users.json';

export async function up(knex: Knex): Promise<void> {
	const users = DefaultUsers.map((user: any) => {
		user.password = hashString(user.password, Number(process.env.SALT_ROUNDS));
		return user;
	});

	return knex.batchInsert('users', users);
}

export async function down(knex: Knex): Promise<void> {
	return DefaultUsers.forEach((user: any) => knex('users').where('email', user.email).del());
}
