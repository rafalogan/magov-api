import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('products_sales', (table: Knex.TableBuilder) => {
		table.integer('product_id').unsigned().references('id').inTable('products').notNullable();
		table.integer('sale_id').unsigned().references('id').inTable('sales').notNullable();
		table.integer('amount').notNullable().defaultTo(1);
		table.primary(['product_id', 'sale_id']);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('products_sales');
}
