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
		level: 0,
		profileCode: 'ROOT',
		unit_id: null,
		tenancy_id: null,
	},
	{
		first_name: 'Contato',
		last_name: 'Magovernance',
		office: 'Gerencia',
		email: 'contato@magov.com.br',
		password: 'Contato@2023',
		cpf: '39734689827',
		phone: '6199147271',
		profileCode: 'MADMIN',
		active: true,
		level: 0,
		unit_id: null,
		tenancy_id: null,
	},
];

export async function up(knex: Knex): Promise<void> {
	const users: any[] = [];

	for (const user of defaultUsers) {
		const profile = await knex('profiles').where({ code: user.profileCode }).select('id').first();

		user.level = Number(profile.id);
		user.password = hashString(user.password, Number(process.env.SALT_ROUNDS));
		Reflect.deleteProperty(user, 'profileCode');

		users.push(user);
	}

	return knex.batchInsert('users', users);
}

export async function down(knex: Knex): Promise<void> {
	return defaultUsers.forEach(({ email }) => knex('users').where({ email }).del());
}
