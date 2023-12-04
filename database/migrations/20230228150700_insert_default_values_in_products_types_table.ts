import { Knex } from 'knex';
import { IProductType } from 'src/repositories/types/product_type';
import { convertDataValues } from 'src/utils';

const values: IProductType[] = [
	{ type: 'plan', description: 'destinado a produtos do tipo plano' },
	{ type: 'credits', description: 'destinado a produtos do tipo creditos de messagem' },
	{ type: 'consultancy', description: 'destinado a produtos do tipo consultoria' },
];

export async function up(knex: Knex): Promise<void> {
	const toSave = values.map(v => convertDataValues(v));

	return knex.batchInsert('products_types', toSave);
}

export async function down(knex: Knex): Promise<void> {
	return values.forEach(({ type }) => knex('products_types').where({ type }).del());
}
