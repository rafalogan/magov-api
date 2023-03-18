import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('tenancies_plans', (table: Knex.TableBuilder) => {
		table.integer('tenancy_id').unsigned().references('id').inTable('tenancies').notNullable();
		table.integer('plan_id').unsigned().references('id').inTable('plans').notNullable();
		table.primary(['tenancy_id', 'plan_id']);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('tenancies_plans');
}
