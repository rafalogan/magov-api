import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('app_screens', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.string('code', 55).notNullable();
		table.string('name', 155).notNullable();
		table.binary('description').nullable();
		table.boolean('active').notNullable().defaultTo(true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('app_screens');
}
