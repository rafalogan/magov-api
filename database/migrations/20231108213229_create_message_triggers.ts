import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('message_triggers', (table: Knex.TableBuilder) => {
		table.integer('tenancy_id').unsigned().references('id').inTable('tenancies').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('message_triggers');
}
