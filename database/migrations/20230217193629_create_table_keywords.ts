import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('keywords', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.string('keyword', 255).notNullable().unique();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('keywords');
}
