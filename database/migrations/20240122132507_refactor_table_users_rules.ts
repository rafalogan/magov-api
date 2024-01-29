import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.dropTable('users_rules');

	await knex.schema.createTable('users_rules', table => {
		table.integer('user_id').unsigned().references('id').inTable('users').notNullable();
		table.integer('rule_id').unsigned().references('id').inTable('rules').notNullable();

		table.primary(['user_id', 'rule_id']);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable('users_rules');

	return knex.schema.createTable('users_rules', (table: Knex.TableBuilder) => {
		table.integer('user_id').unsigned().references('id').inTable('users').notNullable();
		table.integer('screen_id').unsigned().references('id').inTable('app_screens').notNullable();
		table.integer('rule_id').unsigned().references('id').inTable('rules').notNullable();
		table.primary(['user_id', 'screen_id', 'rule_id']);
	});
}
