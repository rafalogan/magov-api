import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('government_expanses_payment', (table: Knex.TableBuilder) => {
		table.integer('government_expanse_id').unsigned().references('id').inTable('government_expanses').notNullable();
		table.integer('revenue_id').unsigned().references('id').inTable('revenues').notNullable();
		table.integer('value').notNullable();
		table.timestamp('date').notNullable().defaultTo(knex.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('government_expanses_payment');
}
