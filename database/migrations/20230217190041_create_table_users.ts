import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('users', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.string('first_name', 50).notNullable();
		table.string('last_name', 50).notNullable();
		table.string('office', 155).notNullable();
		table.string('email', 100).notNullable().unique();
		table.string('password', 255).notNullable();
		table.string('cpf', 20).notNullable();
		table.string('phone', 50).notNullable();
		table.boolean('active').notNullable().defaultTo(true);
		table.integer('level').unsigned().references('id').inTable('profiles').notNullable();
		table.integer('unit_id').unsigned().references('id').inTable('units').nullable();
		table.integer('tenancy_id').unsigned().references('id').inTable('tenancies').nullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('users');
}
