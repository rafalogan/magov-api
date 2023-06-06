import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('products_sales', (table: Knex.TableBuilder) => {
		table.integer('unitary_value').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('products_sales', (table: Knex.TableBuilder) => {
		table.dropColumn('unitary_value');
	});
}
