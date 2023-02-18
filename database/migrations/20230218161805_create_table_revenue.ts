import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('revenues', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.string('revenue', 155).notNullable();
		table.timestamp('receive').notNullable();
		table.binary('description').nullable();
		table.integer('status').notNullable();
		table.boolean('active').notNullable().defaultTo(true);
		table.string('document_url').nullable();
		table.integer('value').notNullable();
		table.integer('unit_id').unsigned().references('id').inTable('units').nullable();
		table.integer('origin_id').unsigned().references('id').inTable('origins').notNullable();
		table.integer('tenancy_id').unsigned().references('id').inTable('tenacies').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('revenues');
}
