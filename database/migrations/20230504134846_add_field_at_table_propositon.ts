import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('propositions', (table: Knex.TableBuilder) => {
		table.string('proposition_url').nullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('propositions', (table: Knex.TableBuilder) => {
		table.dropColumn('proposition_url');
	});
}
