import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('types', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.string('name', 155).notNullable();
		table.boolean('active').notNullable().defaultTo(true);
		table.binary('description').nullable();
		table.integer('parent_id').unsigned().references('id').inTable('types').nullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('types');
}
