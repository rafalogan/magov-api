import { Knex } from 'knex';
import { IScreen } from 'src/repositories/types';

const screens: IScreen[] = [
	{
		code: 'DMDS',
		name: 'Demandas',
		description: 'Tela(s) de gerenciamento de demanda(s)',
		active: true,
	},
	{
		code: 'PRPS',
		name: 'Proposições',
		description: 'Tela(s) de gerenciamento de proposição(ões)',
		active: true,
	},
	{
		code: 'TSKS',
		name: 'Tarefas, Agenda, Kamban & Check-list',
		description: 'Tela de Agenda, Kamban, Check-list e Tarefas para gerenciamento de tarefas e/ou eventos.',
		active: true,
	},
	{
		code: 'CNTS',
		name: 'Contatos',
		description: 'Tela para gerenciamento de contatos e comunicações.',
		active: true,
	},
	{
		code: 'RLTS',
		name: 'Relatórios',
		description: 'Tela para gerenciamento de Relatórios.',
		active: true,
	},
	{
		code: 'FNCG',
		name: 'Financeiro de Gabinete',
		description: 'Tela para gerenciamento de financeiro do Gabinete.',
		active: true,
	},
	{
		code: 'RDPS',
		name: 'Radar de Projetos',
		description: 'Tela de Radar de Projetos',
		active: true,
	},
	{
		code: 'GMPT',
		name: 'Geomapeamento',
		description: 'Tela de Geomapeamento de projetos e politicas publicas.',
		active: true,
	},
	{
		code: 'OPNP',
		name: 'Opinião Publica',
		description: 'Tela de Opinião Publica.',
		active: true,
	},
	{
		code: 'CRMT',
		name: 'Criação de Metas',
		description: 'Tela de criação de metas',
		active: true,
	},
];

export async function up(knex: Knex): Promise<void> {
	return knex.batchInsert('app_screens', screens);
}

export async function down(knex: Knex): Promise<void> {
	return screens.forEach(i => knex('app_screens').where({ code: i.code }).del());
}
