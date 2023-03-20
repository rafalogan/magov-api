import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('products', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.string('name', 50).notNullable().unique();
		table.binary('description').nullable();
		table.boolean('plan').notNullable().defaultTo(false);
		table.integer('limit').nullable();
		table.integer('value').notNullable();
		table.boolean('active').notNullable().defaultTo(true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('products');
}
