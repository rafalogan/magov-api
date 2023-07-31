import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('tasks', (table: Knex.TableBuilder) => {
		table.dropColumn('plaintiff_id');
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('tasks', (table: Knex.TableBuilder) => {
		table.integer('plaintiff_id').unsigned().references('id').inTable('plaintiffs').nullable();
	});
}
