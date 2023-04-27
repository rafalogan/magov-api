import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('files', (table: Knex.TableBuilder) => {
		table.integer('proposition_id').unsigned().references('id').inTable('propositions').nullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('files', (table: Knex.TableBuilder) => {
		table.dropColumn('proposition_id');
	});
}
