import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	const products = await knex('products');

	await knex.schema.alterTable('products', (table: Knex.TableBuilder) => {
		table.integer('type_id').unsigned().references('id').inTable('products_types').notNullable();
	});

	for (const { id, plan } of products) {
		if (plan) {
			const { id: type_id } = await knex('products_types').select('id').where({ type: 'plan' }).first();

			await knex('products').update({ type_id }).where({ id });
		}
	}

	return knex.schema.alterTable('products', (table: Knex.TableBuilder) => {
		table.dropColumn('plan');
	});
}

export async function down(knex: Knex): Promise<void> {
	const products = await knex('products');

	await knex.schema.alterTable('products', (table: Knex.TableBuilder) => {
		table.boolean('plan').nullable();
	});

	const { id: type } = await knex('products_types').select('id').where({ type: 'plan' }).first();

	for (const { id, type_id } of products) {
		if (type_id === type) {
			await knex('products').update({ plan: true }).where({ id });
		}
	}

	return knex.schema.alterTable('products', (table: Knex.TableBuilder) => {
		table.dropColumn('type_id');
	});
}
