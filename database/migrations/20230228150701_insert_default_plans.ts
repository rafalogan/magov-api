import { Knex } from 'knex';
import { isProd } from 'src/utils';
import * as DefaultPlans from '../defaults/plans.json';

export async function up(knex: Knex): Promise<void> {
	if (isProd()) return;

	const plans = DefaultPlans.map(plan => plan);

	return knex.batchInsert('plans', plans);
}

export async function down(knex: Knex): Promise<void> {
	if (isProd()) return;
	return DefaultPlans.forEach(({ name }) => knex('plans').where({ name }).del());
}
