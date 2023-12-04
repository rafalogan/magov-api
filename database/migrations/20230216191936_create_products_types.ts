import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('products_types', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.string('type').notNullable().unique();
		table.binary('description').nullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('products_types');
}
