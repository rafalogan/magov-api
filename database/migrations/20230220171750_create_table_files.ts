import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('files', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.string('title', 155).nullable();
		table.binary('alt').nullable();
		table.string('name', 155).notNullable();
		table.string('filename', 155).notNullable();
		table.string('type', 100).notNullable();
		table.string('url', 255).notNullable();
		table.integer('user_id').unsigned().references('id').inTable('users').nullable();
		table.integer('demand_id').unsigned().references('id').inTable('demands').nullable();
		table.integer('proposition_id').unsigned().references('id').inTable('propositions').nullable();
		table.integer('plaintiff_id').unsigned().references('id').inTable('plaintiffs').nullable();
		table.integer('type_id').unsigned().references('id').inTable('types').nullable();
		table.integer('revenue_id').unsigned().references('id').inTable('revenues').nullable();
		table.integer('government_expanse_id').unsigned().references('id').inTable('government_expenses').nullable();
		table.integer('unit_expanse_id').unsigned().references('id').inTable('units_expenses').nullable();
		table.integer('tenancy_id').unsigned().references('id').inTable('tenancies').nullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('files');
}
