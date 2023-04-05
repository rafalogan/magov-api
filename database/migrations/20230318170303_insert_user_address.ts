import { Knex } from 'knex';
import * as DefaultAdressesUsers from '../defaults/adrress-to-users.json';

export async function up(knex: Knex): Promise<void> {
	const adresses = DefaultAdressesUsers?.map(i => i);

	return knex.batchInsert('adresses', adresses);
}

export async function down(knex: Knex): Promise<void> {
	return DefaultAdressesUsers.forEach(i => knex('adresses').where('user_id', i['user_id']).del());
}
