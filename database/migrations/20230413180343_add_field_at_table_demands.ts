import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('demands', (table: Knex.TableBuilder) => {
		table.integer('approximate_income').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('demands', (table: Knex.TableBuilder) => {
		table.dropColumn('approximate_income');
	});
}
