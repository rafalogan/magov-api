import { Knex } from 'knex';
import TableBuilder = Knex.TableBuilder;

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('tenancies', (table: TableBuilder) => {
		table.increments('id').primary();
		table.string('tenancy_key', 100).nullable();
		table.integer('total_users').nullable();
		table.boolean('active').notNullable().defaultTo(true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('tenancies');
}
