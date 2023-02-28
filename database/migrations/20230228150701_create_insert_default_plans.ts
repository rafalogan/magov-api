import { Knex } from 'knex';
import * as DefaultPlans from '../defaults/plans.json';

export async function up(knex: Knex): Promise<void> {
	return knex.batchInsert('plans', DefaultPlans);
}

export async function down(knex: Knex): Promise<void> {
	return DefaultPlans.forEach((item: any) => knex('plans').where('name', item.name).del());
}
