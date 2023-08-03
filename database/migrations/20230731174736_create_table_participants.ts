import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('participants', (table: Knex.TableBuilder) => {
		table.integer('task_id').unsigned().references('id').inTable('tasks').notNullable();
		table.integer('plaintiff_id').unsigned().references('id').inTable('plaintiffs').notNullable();
		table.primary(['task_id', 'plaintiff_id']);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('participants');
}
