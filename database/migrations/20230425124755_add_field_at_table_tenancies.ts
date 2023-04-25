import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('tenancies_plans', (table: Knex.TableBuilder) => {
		table.integer('unit_id').unsigned().references('id').inTable('units').nullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('tenancies_plans', (table: Knex.TableBuilder) => {
		table.dropColumn('unit_id');
	});
}
