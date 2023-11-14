import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('message_triggers', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.integer('tenancy_id').unsigned().references('id').inTable('tenancies').notNullable();
		table.integer('triggers').notNullable();
		table.timestamp('due_date').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('message_triggers');
}
