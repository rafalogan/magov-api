import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('propositions_themes', (table: Knex.TableBuilder) => {
		table.integer('proposition_id').unsigned().references('id').inTable('propositions').notNullable();
		table.integer('theme_id').unsigned().references('id').inTable('themes').notNullable();
		table.primary(['proposition_id', 'theme_id']);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('propositions_themes');
}
