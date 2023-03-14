import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('tasks', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.string('title', 155).notNullable();
		table.binary('description').nullable();
		table.integer('cost').nullable();
		table.timestamp('start').notNullable();
		table.timestamp('end').notNullable();
		table.integer('level').notNullable();
		table.integer('status').notNullable();
		table.integer('user_id').unsigned().references('id').inTable('users').notNullable();
		table.integer('unit_id').unsigned().references('id').inTable('units').notNullable();
		table.integer('tenacy_id').unsigned().references('id').inTable('tenancies').notNullable();
		table.integer('proposition_id').unsigned().references('id').inTable('propositions').nullable();
		table.integer('demand_id').unsigned().references('id').inTable('demands').nullable();
		table.integer('plaintiff_id').unsigned().references('id').inTable('plaintiffs').nullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('tasks');
}
