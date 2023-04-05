import { Knex } from 'knex';
import { isProd } from 'src/utils';
import * as DefaultThemes from '../defaults/themes.json';

export async function up(knex: Knex): Promise<void> {
	if (isProd()) return;
	const themes = DefaultThemes?.map(t => t);
	return knex.batchInsert('themes', themes);
}

export async function down(knex: Knex): Promise<void> {
	if (isProd()) return;
	return DefaultThemes.forEach(({ name }) => knex('themes').where({ name }).del());
}
