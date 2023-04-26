import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('units', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.string('name', 50).notNullable();
		table.binary('description').nullable();
		table.string('cnpj', 50).notNullable();
		table.string('phone', 45).notNullable();
		table.boolean('active').notNullable().defaultTo(true);
		table.integer('tenancy_id').unsigned().references('id').inTable('tenancies').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('units');
}
