import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('sales', (table: Knex.TableBuilder) => {
		table.integer('commission_installments').notNullable().defaultTo(1);
		table.boolean('active').notNullable().defaultTo(true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('sales', (table: Knex.TableBuilder) => {
		table.dropColumn('commission_installments');
		table.dropColumn('active');
	});
}
