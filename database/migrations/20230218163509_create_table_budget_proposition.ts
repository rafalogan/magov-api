import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('budget_proposals', (table: Knex.TableBuilder) => {
		table.integer('revenue_id').unsigned().references('id').inTable('revenues').notNullable();
		table.integer('propositions_id').unsigned().references('id').inTable('propositions').notNullable();
		table.primary(['revenue_id', 'propositions_id']);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('budget_proposals');
}
