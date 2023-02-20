import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('goals', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.string('goal', 255).notNullable();
		table.boolean('active').notNullable().defaultTo(true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('goals');
}
