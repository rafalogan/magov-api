import { Knex } from 'knex';

import { hashString } from 'src/utils';

const defaultUsers = [
	{
		first_name: 'Root',
		last_name: 'User',
		office: 'root',
		email: 'root@root.com',
		password: '@Root2023',
		cpf: '00000000000',
		phone: '00000000000',
		active: true,
		level: 1000,
		unit_id: null,
		tenancy_id: null,
	},
	{
		first_name: 'Test',
		last_name: 'User',
		office: 'test',
		email: 'test@test.com',
		password: '@test2023',
		cpf: '00000000000',
		phone: '00000000000',
		active: true,
		level: 1000,
		unit_id: null,
		tenancy_id: null,
	},
];

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
