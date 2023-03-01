import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('demands_themes', (table: Knex.TableBuilder) => {
		table.integer('demand_id').unsigned().references('id').inTable('demands').notNullable();
		table.integer('theme_id').unsigned().references('id').inTable('themes').notNullable();
		table.primary(['demand_id', 'theme_id']);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('demands_themes');
}
