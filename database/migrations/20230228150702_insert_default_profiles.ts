import type { Knex } from 'knex';

import { IProfile } from 'src/repositories/types';

const profiles: IProfile[] = [
	{
		name: 'Dev Root',
		code: 'DVROOT',
		description: 'Perfil de desenvolvedor root',
		active: true,
	},
	{
		name: 'Dev',
		code: 'DV',
		description: 'Perfil de desenvolvedor',
		active: true,
	},
	{
		name: 'Master Admin',
		code: 'MADMIN',
		description: 'Perfil de administrador',
		active: true,
	},
	{
		name: 'User Us',
		code: 'USRUS',
		description: 'Perfil de usuário',
		active: true,
	},
	{
		name: 'Master Tenancy',
		code: 'MTENANCY',
		description: 'Perfil de administrador',
		active: true,
	},
	{
		name: 'Chefe de gabinete/1° secretário',
		code: 'CHEFGAB',
		description: 'Perfil de chefe de gabinete/1° secretário',
		active: true,
	},
	{
		name: 'Chefe de setor',
		code: 'CHEFSET',
		description: 'Perfil de chefe de setor',
		active: true,
	},
	{
		name: 'Comunicação',
		code: 'COM',
		description: 'Perfil de comunicação',
		active: true,
	},
	{
		name: 'Jurídico',
		code: 'JUR',
		description: 'Perfil de jurídico',
		active: true,
	},
	{
		name: 'Financeiro',
		code: 'FIN',
		description: 'Perfil de financeiro',
		active: true,
	},
	{
		name: 'RH',
		code: 'RH',
		description: 'Perfil de RH',
		active: true,
	},
	{
		name: 'Assessor comum',
		code: 'ASSCOM',
		description: 'Perfil de assessor comum',
		active: true,
	},
	{
		name: 'Assistente',
		code: 'ASSIST',
		description: 'Perfil de assistente',
		active: true,
	},
];

export async function up(knex: Knex): Promise<void> {
	return knex.batchInsert('profiles', profiles);
}

export async function down(knex: Knex): Promise<void> {
	return profiles.forEach(({ code }) => knex('profiles').where({ code }).del());
}
