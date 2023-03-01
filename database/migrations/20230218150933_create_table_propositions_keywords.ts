import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('propositions_keywords', (table: Knex.TableBuilder) => {
		table.integer('proposition_id').unsigned().references('id').inTable('propositions').notNullable();
		table.integer('keyword_id').unsigned().references('id').inTable('keywords').notNullable();
		table.primary(['proposition_id', 'keyword_id']);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('propositions_keywords');
}
