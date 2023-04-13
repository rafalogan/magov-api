import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('revenues', (table: Knex.TableBuilder) => {
		table.boolean('government').notNullable().defaultTo(false);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('revenues', (table: Knex.TableBuilder) => {
		table.dropColumn('government');
	});
}
