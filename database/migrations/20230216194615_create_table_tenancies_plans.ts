import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('tenancies_plans', (table: Knex.Tablebuilder) => {
		table.integer('tenancy_id').unsigned().references('id').inTable('tenancies').notNullable().primary();
		table.integer('plan_id').unsigned().references('id').inTable('plans').notNullable().primary();
		table.primary(['tenancy_id', 'plan_id']);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('tenancies_plans');
}
