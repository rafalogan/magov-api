import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('types', (table: Knex.TableBuilder) => {
		table.integer('parent_id').unsigned().references('id').inTable('types').nullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('types', (table: Knex.TableBuilder) => {
		table.dropColumn('parent_id');
	});
}
