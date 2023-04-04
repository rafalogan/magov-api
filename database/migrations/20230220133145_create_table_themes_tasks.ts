import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('themes_tasks', (table: Knex.TableBuilder) => {
		table.integer('theme_id').unsigned().references('id').inTable('themes').notNullable();
		table.integer('task_id').unsigned().references('id').inTable('tasks').notNullable();
		table.primary(['theme_id', 'task_id']);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('themes_tasks');
}
