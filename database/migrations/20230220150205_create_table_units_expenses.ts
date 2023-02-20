import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('units_expenses', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.string('expense', 155).notNullable();
		table.binary('description').nullable();
		table.timestamp('due_date').notNullable();
		table.integer('amount').notNullable();
		table.integer('value').notNullable();
		table.integer('installements').notNullable().defaultTo(1);
		table.integer('unit_id').unsigned().references('id').inTable('units').notNullable();
		table.integer('tenancy_id').unsigned().references('id').inTable('tenancies').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('units_expenses');
}
