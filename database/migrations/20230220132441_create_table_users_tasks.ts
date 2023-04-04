import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('users_tasks', (table: Knex.TableBuilder) => {
		table.integer('user_id').unsigned().references('id').inTable('users').notNullable();
		table.integer('task_id').unsigned().references('id').inTable('tasks').notNullable();
		table.primary(['user_id', 'task_id']);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('users_tasks');
}
