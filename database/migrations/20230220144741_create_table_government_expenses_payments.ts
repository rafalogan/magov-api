import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('government_expenses_payment', (table: Knex.TableBuilder) => {
		table.integer('government_expense_id').unsigned().references('id').inTable('government_expenses').notNullable();
		table.integer('revenue_id').unsigned().references('id').inTable('revenues').notNullable();
		table.integer('value').notNullable();
		table.timestamp('date').notNullable().defaultTo(knex.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('government_expenses_payment');
}