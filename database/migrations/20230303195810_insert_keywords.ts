import { Knex } from 'knex';

import { isProd } from 'src/utils';

const defaultKeywords = [
	{
		keyword: 'simon',
	},
	{
		keyword: 'burch',
	},
	{
		keyword: 'woods',
	},
	{
		keyword: 'mccoy',
	},
	{
		keyword: 'jordan',
	},
	{
		keyword: 'gutierrez',
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
