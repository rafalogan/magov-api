import { Knex } from 'knex';

import { isProd } from 'src/utils';

const defaultPlans = [
	{
		name: 'Essencial',
		description: 'Conteudo plano esseicial',
		limit: 20,
		plan: true,
		value: 10000,
		active: true,
	},
	{
		name: 'Explorer',
		description: 'Conteudo plano explorer',
		plan: true,
		limit: 70,
		value: 30000,
		active: true,
	},
	{
		name: 'Master',
		description: 'Conteudo plano Master',
		plan: true,
		limit: 100,
		value: 55000,
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
	if (isProd()) return;

	return knex.batchInsert('products', defaultPlans);
}

export async function down(knex: Knex): Promise<void> {
	if (isProd()) return;
	return defaultPlans.forEach(({ name }) => knex('products').where({ name }).del());
}
