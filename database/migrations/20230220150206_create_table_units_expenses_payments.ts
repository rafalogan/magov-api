import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('units_expenses_payments', (table: Knex.TableBuilder) => {
		table.integer('payment_id').unsigned().references('id').inTable('payments').notNullable();
		table.integer('unit_expense_id').unsigned().references('id').inTable('units_expenses').notNullable();
		table.integer('value').notNullable();
		table.integer('installments').notNullable().defaultTo(1);
		table.primary(['payment_id', 'unit_expense_id']);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('units_expenses_payments');
}
