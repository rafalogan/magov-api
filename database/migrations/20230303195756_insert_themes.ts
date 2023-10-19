import { Knex } from 'knex';

import { isProd } from 'src/utils';

const defaultThemes = [
	{
		name: 'Saúde',
		description: '',
	},
	{
		name: 'Segurança',
		description: '',
	},
	{
		name: 'Educação',
		description: '',
	},
	{
		name: 'Infraestrutura',
		description: '',
	},
	{
		name: 'Transporte',
		description: '',
	},
	{
		name: 'Assistência Social',
		description: '',
	},
	{
		name: 'Cultura e Arte',
		description: '',
	},
	{
		name: 'Economia',
		description: '',
	},
	{
		name: 'Comunicação',
		description: '',
	},
	{
		name: 'Ciência e Tecnologia',
		description: '',
	},
	{
		name: 'Meio Ambiente',
		description: '',
	},
];

export async function up(knex: Knex): Promise<void> {
	return knex.batchInsert('themes', defaultThemes);
}

export async function down(knex: Knex): Promise<void> {
	return defaultThemes.forEach(({ name }) => knex('themes').where({ name }).del());
}
