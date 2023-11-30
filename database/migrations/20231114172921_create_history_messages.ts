import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('history_messages', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.integer('tenancy_id').unsigned().references('id').inTable('tenancies').notNullable();
		table.binary('message').notNullable();
		table.timestamp('send_date').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('history_messages');
}
