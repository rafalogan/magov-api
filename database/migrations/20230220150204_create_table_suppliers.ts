import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('suppliers', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.string('name', 155).notNullable();
		table.binary('description').nullable();
		table.integer('tenancy_id').unsigned().references('id').inTable('tenancies').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('suppliers');
}
