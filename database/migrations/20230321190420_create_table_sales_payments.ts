import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('sales_payments', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.timestamp('pay_date').notNullable();
		table.integer('value').notNullable();
		table.boolean('commission').notNullable().defaultTo(true);
		table.integer('sale_id').unsigned().references('id').inTable('sales').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('sales_payments');
}
