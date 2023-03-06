import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('payments_tenancies', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.timestamp('date').notNullable();
		table.integer('value').notNullable();
		table.integer('tenancy_id').unsigned().references('id').inTable('tenancies').nullable();
		table.integer('saller_id').unsigned().references('id').inTable('users').nullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('payments_tenancies');
}
