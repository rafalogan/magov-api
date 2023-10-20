import { Knex } from 'knex';

const defaultPlans = [
	{
		name: 'Essencial',
		description: 'Conteudo plano esseicial',
		limit: 20,
		plan: true,
		value: 35000,
		active: true,
	},
	{
		name: 'Explorer',
		description: 'Conteudo plano explorer',
		plan: true,
		limit: 50,
		value: 145000,
		active: true,
	},
	{
		name: 'Master',
		description: 'Conteudo plano Master',
		plan: true,
		limit: 50,
		value: 258000,
		active: true,
	},
	{
		name: 'Crédito para 500 disparos/mês R$ 150,00',
		description: 'Conteudo plano Master',
		plan: false,
		limit: 500,
		value: 15000,
		active: true,
	},
	{
		name: 'Consultoria de Marketing R$ 15.000,00',
		description: 'Conteudo plano Master',
		plan: false,
		limit: 0,
		value: 1500000,
		active: true,
	},
];

export async function up(knex: Knex): Promise<void> {
	return knex.batchInsert('products', defaultPlans);
}

export async function down(knex: Knex): Promise<void> {
	return defaultPlans.forEach(({ name }) => knex('products').where({ name }).del());
}
