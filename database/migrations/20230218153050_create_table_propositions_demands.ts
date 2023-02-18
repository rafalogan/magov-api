import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('propositions_demands', (table: Knex.TableBuilder) => {
		table.integer('proposition_id').unsigned().references('id').inTable('propositions').notNullable();
		table.integer('demand_id').unsigned().references('id').inTable('demands').notNullable();
		table.primary(['proposition_id', 'demand_id']);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('propositions_demands');
}
