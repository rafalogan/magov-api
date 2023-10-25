import { Knex } from 'knex';

import { isProd } from 'src/utils';

const defaultKeywords = [
	{
		keyword: 'Legislativo',
	},
	{
		keyword: 'Execultivo',
	},
	{
		keyword: 'Judiciario',
	},
	{
		keyword: 'leg',
	},
	{
		keyword: 'prefeitura',
	},
	{
		keyword: 'secretaria',
	},
];

export async function up(knex: Knex): Promise<void> {
	if (isProd()) return;
	return knex.batchInsert('keywords', defaultKeywords);
}

export async function down(knex: Knex): Promise<void> {
	if (isProd()) return;
	return defaultKeywords.forEach(({ keyword }) => knex('keywords').where({ keyword }).del());
}
