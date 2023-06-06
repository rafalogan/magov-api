import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('sales', (table: Knex.TableBuilder) => {
		table.integer('commission_installments').notNullable().defaultTo(1);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('sales', (table: Knex.TableBuilder) => {
		table.dropColumn('commission_installments');
	});
}
