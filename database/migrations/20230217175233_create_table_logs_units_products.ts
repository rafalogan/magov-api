import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('units_products', (table: Knex.TableBuilder) => {
		table.integer('unit_id').unsigned().references('id').inTable('units').notNullable();
		table.integer('product_id').unsigned().references('id').inTable('products').notNullable();
		table.integer('amount').notNullable().defaultTo(1);
		table.primary(['unit_id', 'product_id']);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('units_products');
}
