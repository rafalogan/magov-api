import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('types', (table: Knex.TableBuilder) => {
		table.integer('file_id').nullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('types', (table: Knex.TableBuilder) => {
		table.dropColumn('file_id');
	});
}
