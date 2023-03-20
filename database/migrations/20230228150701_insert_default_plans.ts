import { Knex } from 'knex';
import { isProd } from 'src/utils';
import * as DefaultPlans from '../defaults/plans.json';

export async function up(knex: Knex): Promise<void> {
	if (isProd()) return;

	const products = DefaultPlans.map(item => item);

	return knex.batchInsert('products', products);
}

export async function down(knex: Knex): Promise<void> {
	if (isProd()) return;
	return DefaultPlans.forEach(({ name }) => knex('products').where({ name }).del());
}
