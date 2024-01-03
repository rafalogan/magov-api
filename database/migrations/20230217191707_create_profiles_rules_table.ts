import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('profiles_rules', table => {
		table.integer('profile_id').unsigned().notNullable();
		table.integer('rule_id').unsigned().notNullable();
		table.primary(['profile_id', 'rule_id']);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('profiles_rules');
}
