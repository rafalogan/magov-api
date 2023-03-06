import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('demands', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.string('name', 155).notNullable();
		table.binary('description').notNullable();
		table.boolean('favorite').notNullable().defaultTo(false);
		table.integer('level').notNullable();
		table.boolean('actice').notNullable().defaultTo(true);
		table.timestamp('dead_line').notNullable();
		table.string('status', 45).nullable();
		table.integer('unit_id').unsigned().references('id').inTable('units').notNullable();
		table.integer('user_id').unsigned().references('id').inTable('users').notNullable();
		table.integer('plaintiff_id').unsigned().references('id').inTable('plaintiffs').notNullable();
		table.integer('tenancy_id').unsigned().references('id').inTable('tenancies').notNullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('demands');
}
