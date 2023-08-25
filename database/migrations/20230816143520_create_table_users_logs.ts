import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('users_logs', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.string('action', 45).notNullable();
		table.string('in_table', 155).notNullable();
		table.integer('in_table_id').notNullable();
		table.timestamp('log_date').notNullable();
		table.integer('user_id').unsigned().references('id').inTable('users').notNullable();
		table.integer('tenancy_id').unsigned().references('id').inTable('tenancies').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('users_logs');
}
