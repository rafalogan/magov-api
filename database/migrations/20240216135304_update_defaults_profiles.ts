import type { Knex } from 'knex';

const data = [
	{
		code: 'ROOT',
		description: 'Perfil de desenvolvedor root',
	},
	{
		code: 'DV',
		description: 'Perfil de desenvolvedor',
	},
	{
		code: 'MADMIN',
		description: 'Perfil de administrador',
	},
	{
		code: 'USRUS',
		description: 'Perfil de usuário',
	},
	{
		code: 'MTENANCY',
		description: 'Perfil de administrador',
	},
	{
		code: 'CHEFGAB',
		description:
			'É a pessoa encarregada pela gestão, coordenação e análise de todas as atividades do governo, auxiliando diretamente o(à) político(a)',
	},
	{
		code: 'CHEFSET',
		description:
			'É a pessoa responsável e líder da unidade, seja uma secretaria, departamento ou qualquer outro tipo de equipe e/ou unidade. Ele que coordena os trabalhos e organização das atividades, metas e implementação de projetos. Ele responde diretamente ao chefe de gabinete/ 1° secretário(a) e ao político(a)',
	},
	{
		code: 'COM',
		description:
			'É o responsável pela comunicação com a população, é quem divulga os projetos e trabalhos, fundamental para a prestação de contas e análise do humor e personalidade da opinião pública (como comunicar de forma eficaz com a população)',
	},
	{
		code: 'JUR',
		description:
			'Responsável pela criação, elaboração e gerenciamento de proposições. Desde da elaboração de leis à licitações e contratos. São as pessoas que trabalham tudo relacionado à leis, projetos, requerimentos e etc.',
	},
	{
		code: 'FIN',
		description:
			'Responsável em gerir e administrar as receitas e despesas, empenhar e protocolar os documentos. anexar as contas e receitas, preparar tudo para a prestação de contas',
	},
	{
		code: 'RH',
		description:
			'São as pessoas responsáveis em criar, desativar, reativar perfis, editar e liberar acessos, realizar os pagamentos, executar a folha, gerir férias e dipensas.',
	},
	{
		code: 'ASSCOM',
		description:
			'São as pessoas responsáveis por tarefas operacionais restritas às suas próprias obrigações. Mas cadastra demandas e proposições podendo direcionar à todas as pessoas de sua unidade.',
	},
	{
		code: 'ASSIST',
		description: 'São as pessoas operacionais que auxiliam e assistem aos demais cargos e funções, são restitos às suas tarefas.',
	},
];

export async function up(knex: Knex): Promise<void> {
	return data.forEach(async ({ code, description }) => knex('profiles').update({ description }).where({ code }));
}

export async function down(knex: Knex): Promise<void> {
	return data.forEach(async ({ code }) => knex('profiles').update({ description: '' }).where({ code }));
}
