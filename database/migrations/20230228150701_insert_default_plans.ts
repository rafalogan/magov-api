import { Knex } from 'knex';
import { IProduct } from 'src/repositories/types';
import { convertDataValues } from 'src/utils';

const defaultPlans: IProduct[] = [
	{
		name: 'Essencial',
		description: 'Conteudo plano esseicial',
		limit: 20,
		type: 'plan',
		typeId: 0,
		value: 35000,
		active: true,
	},
	{
		name: 'Explorer',
		description: 'Conteudo plano explorer',
		type: 'plan',
		typeId: 0,
		limit: 50,
		value: 145000,
		active: true,
	},
	{
		name: 'Master',
		description: 'Conteudo plano Master',
		type: 'plan',
		typeId: 0,
		limit: 50,
		value: 258000,
		active: true,
	},
	{
		name: 'Crédito para 500 disparos/mês R$ 150,00',
		description: 'Conteudo plano Master',
		type: 'credits',
		typeId: 0,
		limit: 500,
		value: 15000,
		active: true,
	},
	{
		name: 'Consultoria de Marketing R$ 15.000,00',
		description: 'Conteudo plano Master',
		type: 'consultancy',
		typeId: 0,
		limit: 0,
		value: 1500000,
		active: true,
	},
];

export async function up(knex: Knex): Promise<void> {
	const toSave: any[] = [];

	for (const item of defaultPlans) {
		const { id: typeId } = await knex('products_types').select('id').where({ type: item.type }).first();

		Reflect.deleteProperty(item, 'type');

		toSave.push({ ...item, typeId });
	}

	return knex.batchInsert(
		'products',
		toSave.map(i => convertDataValues(i))
	);
}

export async function down(knex: Knex): Promise<void> {
	return defaultPlans.forEach(({ name }) => knex('products').where({ name }).del());
}
