import { Knex } from 'knex';
import { isProd } from 'src/utils';
import * as DefaultKeywords from '../defaults/keykords.json';

export async function up(knex: Knex): Promise<void> {
	if (isProd()) return;
	const keywords = DefaultKeywords?.map(k => k);
	return knex.batchInsert('keywords', keywords);
}

export async function down(knex: Knex): Promise<void> {
	if (isProd()) return;
	return DefaultKeywords.forEach(({ keyword }) => knex('keywords').where({ keyword }).del());
}
