import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.alterTable('history_messages', (table: Knex.TableBuilder) => {
		table.timestamp('expires_at').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.alterTable('history_messages', (table: Knex.TableBuilder) => {
		table.dropColumn('expires_at');
	});
}
