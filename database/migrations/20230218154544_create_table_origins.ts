import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('origins', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.string('origin', 155).notNullable();
		table.binary('description').nullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('origins');
}
