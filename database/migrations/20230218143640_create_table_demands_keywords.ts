import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('demands_keywords', (table: Knex.TableBuilder) => {
		table.integer('demand_id').unsigned().references('id').inTable('demands').notNullable();
		table.integer('keyword_id').unsigned().references('id').inTable('keywords').notNullable();
		table.primary(['demand_id', 'keyword_id']);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('demands_keywords');
}
