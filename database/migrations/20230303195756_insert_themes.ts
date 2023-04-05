import { Knex } from 'knex';

import { isProd } from 'src/utils';
import { defaultThemes } from '../defaults/themes';

export async function up(knex: Knex): Promise<void> {
	if (isProd()) return;
	return knex.batchInsert('themes', defaultThemes);
}

export async function down(knex: Knex): Promise<void> {
	if (isProd()) return;
	return defaultThemes.forEach(({ name }) => knex('themes').where({ name }).del());
}
