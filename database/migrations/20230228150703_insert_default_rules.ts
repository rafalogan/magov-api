import type { Knex } from 'knex';

import { IRule } from 'src/repositories/types';

const rules: IRule[] = [
	{
		name: 'root access',
		code: 'ROOT',
		description: 'Acesso total',
	},
	{
		name: 'Tasks da unidade',
		code: 'TASKSUNIT',
		description: 'Criar e editar tarefas de todos da unidade',
	},
	{
		name: 'Tasks do tenancy',
		code: 'TASKSTENANCY',
		description: 'Criar e editar tarefas de todas unidades do tenancy',
	},
	{
		name: 'Demandas da unidade',
		code: 'DEMANDSUNIT',
		description: 'Criar Demandas (designar para todos de sua unidade)',
	},
	{
		name: 'Demands do tenancy',
		code: 'DEMANDSTENANCY',
		description: 'Criar Demandas (designar para todos de todas  as unidades do tenancy)',
	},
	{
		name: 'Acesso total as proposições',
		code: 'PROPOSTENANCY',
		description: 'todas as proposições à todos dos tenancy',
	},
	{
		name: 'Acesso a proposições do tenancy',
		code: 'PROPOSTENANCYBASIC',
		description: 'Proposições básicas: (comunicado, moção, ofício, recurso e requerimento) para todos os usuários do tenancy',
	},
	{
		name: 'Acesso a criar proposição do tipo oficio do tenancy',
		code: 'PROPOSTENANCYCRAFT',
		description: 'Só pode criar ofício para todos os usuários do tenancy',
	},
	{
		name: 'Editar só as próprias proposições',
		code: 'EDITYOURPROPOST',
		description: 'Pode editar apenas as proposições criadas por ele mesmo',
	},
	{
		name: 'Editar todas as proposições',
		code: 'EDITALLPROPOST',
		description: 'Pode editar proposição e adicionar aos gastos de governo',
	},
	{
		name: 'Chek list e Kanban da unidade',
		code: 'CHECKLISTKANBANUNIT',
		description: 'Check list e kanban (de todos da unidade)',
	},
	{
		name: 'Chek list e Kanban do tenancy',
		code: 'CHECKLISTKANBANTENANCY',
		description: 'Check list e kanban (de todos de todas as unidades).',
	},
	{
		name: 'Acesso aos contatos',
		code: 'CONTACTSACESS',
		description: 'Pode acessar Lista de Contatos',
	},
	{
		name: 'Relatórios de produtividade da unidade',
		code: 'REPORTPRODUNIT',
		description: 'Pode ver relatório de produtividade de todos da unidade',
	},
	{
		name: 'Relatórios de produtividade do tenancy',
		code: 'REPORTPRODTENANCY',
		description: 'Pode ver relatório de produtividade de todos de todas as uniades',
	},
	{
		name: 'Relatórios de demandas',
		code: 'REPORTDEMANDS',
		description: 'Pode ver relatório de demandas',
	},
	{
		name: 'Dados do mandato',
		code: 'MANDATEDATA',
		description: 'Pode ver dados do mandato',
	},
	{
		name: 'Controle Orçamentário',
		code: 'BUDGETCONTROL',
		description: 'Pode ver controle orçamentário',
	},
	{
		name: 'Criar Unidades e Usuários',
		code: 'CREATEUNITUSERTENANCY',
		description: 'Pode criar unidades e cadastras usuários; (pode cadastrar de outras unidades)',
	},
	{
		name: 'Pode editar Unidades e Usuários',
		code: 'EDITUNITUSERTENANCY',
		description: 'Pode editar unidades e cadastras usuários; (pode editar de outras unidades)',
	},
	{
		name: 'Criar Usuários da Unidade',
		code: 'CREATEUNITUSER',
		description: 'Pode criar usuários da unidade',
	},
	{
		name: 'Radar de Projetos',
		code: 'PROJECTRADAR',
		description: 'Pode ver radar de projetos',
	},
	{
		name: 'Geomapeamento',
		code: 'GEOMAP',
		description: 'Pode ver geomapeamento',
	},
	{
		name: 'Financeiro da unidade',
		code: 'FINANCEUNIT',
		description: 'Pode ver financeiro da unidade',
	},
	{
		name: 'Gestão de documentos',
		code: 'DOCUMENTMANAGEMENT',
		description: 'Pode ver gestão de documentos',
	},
	{
		name: 'Relatório Observatório Fiscal',
		code: 'REPORTOBSERVATORY',
		description: 'Pode ver relatório do observatório fiscal',
	},
	{
		name: 'Relatório Tesouro nacional',
		code: 'REPORTTREASURY',
		description: 'Pode ver relatório do tesouro nacional',
	},
	{
		name: 'Licitação passo a passo',
		code: 'BIDDINGSTEPBYSTEP',
		description: 'Pode ver licitação passo a passo',
	},
	{
		name: 'Criar Metas',
		code: 'CREATEGOALS',
		description: 'Pode criar metas',
	},
	{
		name: 'Opinião Pública',
		code: 'PUBLICOPINION',
		description: 'Pode ver opinião pública',
	},
	{
		name: 'Relatório de Metas',
		code: 'REPORTGOALS',
		description: 'Pode ver relatório de metas',
	},
	{
		name: 'Relatórios Resultado Eleições',
		code: 'REPORTELECTIONRESULT',
		description: 'Pode ver relatório resultado das eleições',
	},
	{
		name: 'Relatórios Perfil do Eleitorado',
		code: 'REPORTVOTERPROFILE',
		description: 'Pode ver relatório perfil do eleitorado',
	},
	{
		name: 'Dropdow IBGE',
		code: 'DROPDOWNIBGE',
		description: 'Pode ver dropdow IBGE',
	},
	{
		name: 'Processos Jridicos',
		code: 'LEGALPROCESSES',
		description: 'Pode ver processos jurídicos',
	},
	{
		name: 'Acesso total as Vendas',
		code: 'SALESACCESS',
		description: 'cadastrar vendas e dar baixa',
	},
	{
		name: 'Acesso de Master Admin',
		code: 'MASTERADMIN',
		description: 'pode acessar tudo (editar temas, editar keywords, criar regras, buscar proposições em todos so tenancy)',
	},
];

export async function up(knex: Knex): Promise<void> {
	return knex.batchInsert('rules', rules);
}

export async function down(knex: Knex): Promise<void> {
	return rules.forEach(({ code }) => knex('rules').where({ code }).del());
}
