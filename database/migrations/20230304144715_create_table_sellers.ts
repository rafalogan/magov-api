import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('sellers', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.string('seller', 155).notNullable();
		table.string('cpf', 50).notNullable().unique();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('sellers');
}
