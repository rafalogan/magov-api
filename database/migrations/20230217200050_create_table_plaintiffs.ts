import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('plaintiffs', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.string('name', 155).notNullable();
		table.timestamp('birthday').notNullable();
		table.string('institute', 255).notNullable();
		table.string('relationship_type', 100).nullable();
		table.binary('observation').nullable();
		table.string('relatives', 255).nullable();
		table.string('voter_registration', 50).nullable();
		table.integer('parent_id').unsigned().references('id').inTable('plaintiffs').nullable();
		table.integer('tenancy_id').unsigned().references('id').inTable('tenancies').notNullable();
		table.integer('institute_type_id').unsigned().references('id').inTable('institutes_type').nullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('plaintiffs');
}
