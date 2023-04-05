import { Knex } from 'knex';
import { defaultAddressUsers } from 'database/defaults/adrress-to-users';

export async function up(knex: Knex): Promise<void> {
	return knex.batchInsert('adresses', defaultAddressUsers);
}

export async function down(knex: Knex): Promise<void> {
	return defaultAddressUsers.forEach(i => knex('adresses').where('user_id', i['user_id']).del());
}
