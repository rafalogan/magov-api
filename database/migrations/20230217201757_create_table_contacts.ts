import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('contacts', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.string('email', 255).notNullable();
		table.string('phone', 50).notNullable();
		table.integer('tenancy_id').unsigned().references('id').inTable('tenancies').notNullable();
		table.integer('plaintiff_id').unsigned().references('id').inTable('plaintiffs').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('contacts');
}
