import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('sales_payments', (table: Knex.TableBuilder) => {
		table.string('type', 155).notNullable();
		table.integer('installment').notNullable().defaultTo(1);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('sales_payments', (table: Knex.TableBuilder) => {
		table.dropColumn('type');
		table.dropColumn('installment');
	});
}
