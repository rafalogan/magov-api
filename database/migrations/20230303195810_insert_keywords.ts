import { Knex } from 'knex';

import { isProd } from 'src/utils';
import { defaultKeywords } from '../defaults/keykords';

export async function up(knex: Knex): Promise<void> {
	if (isProd()) return;
	return knex.batchInsert('keywords', defaultKeywords);
}

export async function down(knex: Knex): Promise<void> {
	if (isProd()) return;
	return defaultKeywords.forEach(({ keyword }) => knex('keywords').where({ keyword }).del());
}
