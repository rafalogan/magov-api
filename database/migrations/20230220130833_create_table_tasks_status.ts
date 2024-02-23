import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('tasks_status', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.string('status').notNullable().unique();
		table.binary('description').nullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('tasks_status');
}
