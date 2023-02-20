import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('adresses', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.string('cep', 50).notNullable();
		table.string('street', 155).notNullable();
		table.integer('number').nullable();
		table.string('complement', 155).nullable();
		table.string('district', 155).notNullable();
		table.string('city', 155).notNullable();
		table.string('uf', 50).notNullable();
		table.integer('unit_id').unsigned().references('id').inTable('units').nullable();
		table.integer('user_id').unsigned().references('id').inTable('users').nullable();
		table.integer('plaintiff_id').unsigned().references('id').inTable('plaintiffs').nullable();
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('adresses');
}
