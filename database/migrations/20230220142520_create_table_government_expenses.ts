import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('government_expenses', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.string('expense', 155).notNullable();
		table.binary('description').nullable();
		table.timestamp('due_date').notNullable();
		table.integer('value').notNullable();
		table.binary('observations').nullable();
		table.boolean('active').notNullable().defaultTo(true);
		table.integer('user_id').unsigned().references('id').inTable('users').notNullable();
		table.integer('proposition_id').unsigned().references('id').inTable('propositions').nullable();
		table.integer('tasks_id').unsigned().references('id').inTable('tasks').nullable();
		table.integer('tenancy_id').unsigned().references('id').inTable('tenancies').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('government_expenses');
}
