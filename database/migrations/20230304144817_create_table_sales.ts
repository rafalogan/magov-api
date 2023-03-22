import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('sales', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.timestamp('due_date').notNullable();
		table.integer('value').notNullable();
		table.integer('commission_value').notNullable();
		table.integer('installments').notNullable();
		table.binary('description').nullable();
		table.integer('payment_id').unsigned().references('id').inTable('payments').notNullable();
		table.integer('unit_id').unsigned().references('id').inTable('units').notNullable();
		table.integer('tenancy_id').unsigned().references('id').inTable('tenancies').notNullable();
		table.integer('user_id').unsigned().references('id').inTable('users').notNullable();
		table.integer('seller_id').unsigned().references('id').inTable('sellers').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('sales');
}
