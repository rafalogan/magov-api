import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('sales', (table: Knex.TableBuilder) => {
		table.integer('saller_id').unsigned().references('id').inTable('users').notNullable();
		table.integer('tenancy_id').unsigned().references('id').inTable('tenancies').notNullable();
		table.primary(['saller_id', 'tenancy_id']);
		table.timestamp('commision_date').notNullable();
		table.integer('commission_value').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('sales');
}
