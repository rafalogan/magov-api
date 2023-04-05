import { Knex } from 'knex';

import { isProd } from 'src/utils';
import { defaultPlans } from 'database/defaults/plans';

export async function up(knex: Knex): Promise<void> {
	if (isProd()) return;

	return knex.batchInsert('products', defaultPlans);
}

export async function down(knex: Knex): Promise<void> {
	if (isProd()) return;
	return defaultPlans.forEach(({ name }) => knex('products').where({ name }).del());
}
