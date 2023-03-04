import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('sales', (table: Knex.TableBuilder) => {
		table.integer('seller_id').unsigned().references('id').inTable('users').notNullable();
		table.integer('tenancy_id').unsigned().references('id').inTable('tenancies').notNullable();
		table.integer('user_id').unsigned().references('id').inTable('users').notNullable();
		table.timestamp('commision_date').notNullable();
		table.integer('commission_value').notNullable();
		table.primary(['saller_id', 'tenancy_id', 'user_id']);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('sales');
}
