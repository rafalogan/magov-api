import { Knex } from 'knex';
import TableBuilder = Knex.TableBuilder;

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('plans', (table: TableBuilder) => {
		table.increments('id').primary();
		table.string('name', 50).notNullable();
		table.binary('description').nullable();
		table.integer('user_limit').nullable();
		table.integer('unitary_value').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('plans');
}
