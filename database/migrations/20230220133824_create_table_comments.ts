import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('comments', (table: Knex.TableBuilder) => {
		table.integer('id').primary();
		table.binary('comment').notNullable();
		table.boolean('active').notNullable().defaultTo(true);
		table.integer('task_id').unsigned().references('id').inTable('tasks').nullable();
		table.integer('parent_id').unsigned().references('id').inTable('comments').nullable();
		table.integer('user_id').unsigned().references('id').inTable('users').notNullable();
		table.integer('tenancy_id').unsigned().references('id').inTable('tenancies').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('comments');
}
