import { Knex } from 'knex';
import { isProd } from 'src/utils';
import * as DefaultKeywords from '../defaults/keykords.json';

export async function up(knex: Knex): Promise<void> {
	if (isProd()) return;
	return knex.batchInsert('keywords', DefaultKeywords);
}

export async function down(knex: Knex): Promise<void> {
	if (isProd()) return;
	return DefaultKeywords.forEach(({ keyword }) => knex('keywords').where({ keyword }).del());
}
