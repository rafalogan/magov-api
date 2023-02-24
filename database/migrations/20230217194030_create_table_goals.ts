import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('goals', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.string('goal', 255).notNullable();
		table.boolean('active').notNullable().defaultTo(true);
		table.integer('tenancy_id').unsigned().references('id').inTable('tenancies').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('goals');
}
