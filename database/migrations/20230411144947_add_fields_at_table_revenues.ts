import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('revenues', (table: Knex.TableBuilder) => {
		table.string('document_number').nullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('users', (table: Knex.TableBuilder) => {
		table.dropColumn('document_number');
	});
}
