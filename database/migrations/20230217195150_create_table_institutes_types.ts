import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('institutes_types', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.string('name', 155).notNullable();
		table.boolean('active').notNullable().defaultTo(true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('institutes_types');
}
