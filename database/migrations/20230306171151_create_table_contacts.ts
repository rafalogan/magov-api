import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('contacts', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.string('phone', 45).notNullable();
		table.string('email', 155).notNullable();
		table.integer('plaintiffId').unsigned().references('id').inTable('plaintiffs').notNullable();
		table.integer('tenancyId').unsigned().references('id').inTable('tenancies').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('contacts');
}
