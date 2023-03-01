import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('propositions', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.string('title', 100).notNullable();
		table.binary('menu').notNullable();
		table.timestamp('deadline').notNullable();
		table.boolean('active').notNullable().defaultTo(true);
		table.integer('expense').nullable();
		table.integer('parent_id').unsigned().references('id').inTable('propositions').nullable();
		table.integer('unit_id').unsigned().references('id').inTable('units').notNullable();
		table.integer('type_id').unsigned().references('id').inTable('types').notNullable();
		table.integer('tenancy_id').unsigned().references('id').inTable('tenancies').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('propositions');
}
