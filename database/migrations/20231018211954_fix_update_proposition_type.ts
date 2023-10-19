import { Knex } from 'knex';
import { IPropositionsTypeViewModel } from 'src/repositories/types';

const modelsTypes: IPropositionsTypeViewModel[] = [
	{
		name: 'Comunicados',
		description: undefined,
		active: true,
		subTypes: [],
	},
	{
		name: 'Convênios',
		description: undefined,
		active: true,
		subTypes: [
			{
				name: 'MROSC',
				description: undefined,
				active: true,
				subTypes: [
					{ name: 'Termo de Colaboração', description: undefined, active: true, subTypes: [] },
					{ name: 'Acordo de Cooperação Eventos', description: undefined, active: true, subTypes: [] },
					{ name: 'Acordo de Cooperação Compartilhamento de Bens', description: undefined, active: true, subTypes: [] },
					{ name: 'Lista de Verificação(Sem Compartilhamento Patrimônio)', description: undefined, active: true, subTypes: [] },
					{ name: 'Lista de Verificação(Termo de Colaboração)', description: undefined, active: true, subTypes: [] },
					{ name: 'Edital Colaboração', description: undefined, active: true, subTypes: [] },
					{ name: 'Edital Fomento', description: undefined, active: true, subTypes: [] },
				],
			},
			{
				name: 'Contrato de Repasse',
				description: undefined,
				active: true,
				subTypes: [
					{ name: 'Acordo de Cooperação Técnica', description: undefined, active: true, subTypes: [] },
					{ name: 'Minuta de Repasse', description: undefined, active: true, subTypes: [] },
					{ name: 'Plano de Trabalho Protocolo de Intenções(Sem Repasse)', description: undefined, active: true, subTypes: [] },
					{ name: 'Plano de Trabalho Cooperação Técnica(Sem Repasse)', description: undefined, active: true, subTypes: [] },
					{ name: 'Protocolo de Intenções', description: undefined, active: true, subTypes: [] },
				],
			},
			{
				name: 'Convênios',
				description: undefined,
				active: true,
				subTypes: [
					{ name: 'Declaração de Regularidade Pagamentos Precatórios', description: undefined, active: true, subTypes: [] },
					{ name: 'Lista de Verificação Entes Públicos', description: undefined, active: true, subTypes: [] },
					{ name: 'Minuta Obras', description: undefined, active: true, subTypes: [] },
					{ name: 'Edital de Chamamento Público', description: undefined, active: true, subTypes: [] },
					{ name: 'Termo(Sem execução de Serviços de Engenharia)', description: undefined, active: true, subTypes: [] },
				],
			},
			{
				name: 'Termos de Execução Descentralizada',
				description: undefined,
				active: true,
				subTypes: [],
			},
		],
	},
	{
		name: 'Criação de Projetos',
		description: undefined,
		active: true,
		subTypes: [
			{ name: 'Decreto Legislativo', description: undefined, active: true, subTypes: [] },
			{ name: 'Data Comemorativa', description: undefined, active: true, subTypes: [] },
			{ name: 'Declaração de Utilidade Pública', description: undefined, active: true, subTypes: [] },
			{ name: 'Lei Complementar', description: undefined, active: true, subTypes: [] },
			{ name: 'Lei Ordinária', description: undefined, active: true, subTypes: [] },
			{ name: 'Denominação de Local', description: undefined, active: true, subTypes: [] },
			{ name: 'Doação de Imóveis', description: undefined, active: true, subTypes: [] },
			{ name: 'Resolução', description: undefined, active: true, subTypes: [] },
		],
	},
	{
		name: 'Emenda',
		description: undefined,
		active: true,
		subTypes: [
			{ name: 'Emendas Parlamentares Gerais', description: undefined, active: true, subTypes: [] },
			{ name: 'Emenda de Lei Orgânica', description: undefined, active: true, subTypes: [] },
			{ name: 'Emenda Orçamentária', description: undefined, active: true, subTypes: [] },
			{ name: 'PEC', description: undefined, active: true, subTypes: [] },
		],
	},
	{
		name: 'Indicação',
		description: undefined,
		active: true,
		subTypes: [
			{ name: 'Ação', description: undefined, active: true, subTypes: [] },
			{ name: 'Solicitação de Informação', description: undefined, active: true, subTypes: [] },
			{ name: 'Utilidade Pública', description: undefined, active: true, subTypes: [] },
		],
	},
	{
		name: 'Licitação',
		description: undefined,
		active: true,
		subTypes: [
			{
				name: 'Atas',
				description: undefined,
				active: true,
				subTypes: [
					{ name: 'Registro de Preço', description: undefined, active: true, subTypes: [] },
					{ name: 'Serviços Comuns de Engenharia', description: undefined, active: true, subTypes: [] },
					{ name: 'Serviços Continuados Exclusivos', description: undefined, active: true, subTypes: [] },
					{ name: 'Serviços Continuados Não Exclusivos', description: undefined, active: true, subTypes: [] },
					{ name: 'Serviços Não Continuados', description: undefined, active: true, subTypes: [] },
					{ name: 'Serviços de Tecnologia - TIC', description: undefined, active: true, subTypes: [] },
				],
			},
			{
				name: 'Contratos',
				description: undefined,
				active: true,
				subTypes: [
					{ name: 'Compras', description: undefined, active: true, subTypes: [] },
					{ name: 'Serviços de Engenharia', description: undefined, active: true, subTypes: [] },
					{ name: 'Serviços Comuns de Engenharia', description: undefined, active: true, subTypes: [] },
					{ name: 'Projeto Básico de Engenharia', description: undefined, active: true, subTypes: [] },
					{ name: 'Serviços Continuados Exclusivos', description: undefined, active: true, subTypes: [] },
					{ name: 'Serviços Continuados Não Exclusivos', description: undefined, active: true, subTypes: [] },
					{ name: 'Serviços de Tecnologia - TIC', description: undefined, active: true, subTypes: [] },
					{ name: 'Serviços Não Continuados', description: undefined, active: true, subTypes: [] },
					{ name: 'Capacitação de Inexigibilidade Licitação', description: undefined, active: true, subTypes: [] },
					{ name: 'Projeto Básico de Inexigibilidade', description: undefined, active: true, subTypes: [] },
					{ name: 'Minuta de Dispensa Eletrônica', description: undefined, active: true, subTypes: [] },
					{ name: 'Termo de Justificativa de Técnica Relevante', description: undefined, active: true, subTypes: [] },
					{ name: 'Termo de Locação de Imóvel', description: undefined, active: true, subTypes: [] },
				],
			},
			{
				name: 'Editais',
				description: undefined,
				active: true,
				subTypes: [
					{ name: 'Coleta Seletiva', description: undefined, active: true, subTypes: [] },
					{ name: 'Processo Licitatório Presencial', description: undefined, active: true, subTypes: [] },
					{ name: 'Pregão Compras', description: undefined, active: true, subTypes: [] },
					{ name: 'Pregão Engenharia', description: undefined, active: true, subTypes: [] },
					{ name: 'Pregão Eletrônico Sem Exclusividade', description: undefined, active: true, subTypes: [] },
					{ name: 'Serviços Continuados Não Exclusivos', description: undefined, active: true, subTypes: [] },
					{ name: 'Serviços Não Continuados', description: undefined, active: true, subTypes: [] },
					{ name: 'Serviços de Dedicação Exclusiva', description: undefined, active: true, subTypes: [] },
					{ name: 'Serviços de Tecnologia - TIC', description: undefined, active: true, subTypes: [] },
					{ name: 'Tomada de Preços', description: undefined, active: true, subTypes: [] },
					{ name: 'Convite', description: undefined, active: true, subTypes: [] },
					{ name: 'Concorrência de Engenharia', description: undefined, active: true, subTypes: [] },
				],
			},
			{
				name: 'Estudo Técnico Preliminar',
				description: undefined,
				active: true,
				subTypes: [],
			},
			{
				name: 'Lista de Verificação',
				description: undefined,
				active: true,
				subTypes: [
					{ name: 'Adesão ao Sistema de Preços', description: undefined, active: true, subTypes: [] },
					{ name: 'Adiantamentos Contratuais', description: undefined, active: true, subTypes: [] },
					{ name: 'Compras', description: undefined, active: true, subTypes: [] },
					{ name: 'Serviços', description: undefined, active: true, subTypes: [] },
					{ name: 'Engenharia', description: undefined, active: true, subTypes: [] },
					{ name: 'Serviço de Tecnologia - TIC', description: undefined, active: true, subTypes: [] },
					{ name: 'Contratação Direta', description: undefined, active: true, subTypes: [] },
				],
			},
			{ name: 'Pregão Eletrônico Geral', description: undefined, active: true, subTypes: [] },
			{
				name: 'RDC',
				description: undefined,
				active: true,
				subTypes: [
					{ name: 'Verificação de Obras', description: undefined, active: true, subTypes: [] },
					{ name: 'Minuta Contratual', description: undefined, active: true, subTypes: [] },
					{ name: 'Edital de Obras', description: undefined, active: true, subTypes: [] },
					{ name: 'Projeto Básico', description: undefined, active: true, subTypes: [] },
					{ name: 'Lista de Verificação', description: undefined, active: true, subTypes: [] },
				],
			},
			{
				name: 'Termo Aditivo',
				description: undefined,
				active: true,
				subTypes: [
					{ name: 'Prorrogação COntratual', description: undefined, active: true, subTypes: [] },
					{ name: 'Alteração Quantitativa', description: undefined, active: true, subTypes: [] },
				],
			},
			{
				name: 'Termo de Referência',
				description: undefined,
				active: true,
				subTypes: [
					{ name: 'Compras', description: undefined, active: true, subTypes: [] },
					{ name: 'Engenharia', description: undefined, active: true, subTypes: [] },
					{ name: 'Serviços Continuados Exclusivos', description: undefined, active: true, subTypes: [] },
					{ name: 'Serviços Continuados Não Exclusivos', description: undefined, active: true, subTypes: [] },
					{ name: 'Serviços Não Continuados', description: undefined, active: true, subTypes: [] },
				],
			},
		],
	},

	{
		name: 'Moção',
		description: undefined,
		active: true,
		subTypes: [
			{ name: 'Básica', description: undefined, active: true, subTypes: [] },
			{ name: 'Condolências', description: undefined, active: true, subTypes: [] },
			{ name: 'Congratulações', description: undefined, active: true, subTypes: [] },
			{ name: 'Indicação', description: undefined, active: true, subTypes: [] },
		],
	},
	{
		name: 'Ofício',
		description: undefined,
		active: true,
		subTypes: [],
	},
	{
		name: 'Questão de Ordem',
		description: undefined,
		active: true,
		subTypes: [],
	},
	{
		name: 'Pareceres',
		description: undefined,
		active: true,
		subTypes: [],
	},
	{
		name: 'Recursos',
		description: undefined,
		active: true,
		subTypes: [
			{ name: 'Contra Declaração de Prejudicialidade', description: undefined, active: true, subTypes: [] },
			{ name: 'Contra Devolução de Proposição', description: undefined, active: true, subTypes: [] },
			{ name: 'Contra Presidente Questão de Ordem', description: undefined, active: true, subTypes: [] },
			{ name: 'Contra Recusa de Emenda Pelo Presidente', description: undefined, active: true, subTypes: [] },
			{ name: 'Efeito Suspensivo', description: undefined, active: true, subTypes: [] },
			{ name: 'Contra Parecer de Comissão', description: undefined, active: true, subTypes: [] },
		],
	},
	{
		name: 'Requerimentos',
		description: undefined,
		active: true,
		subTypes: [
			{ name: 'Informação[5 mod.docs]', description: undefined, active: true, subTypes: [] },
			{
				name: 'Constituição de Comissão',
				description: undefined,
				active: true,
				subTypes: [
					{ name: 'Composição de CPI', description: undefined, active: true, subTypes: [] },
					{ name: 'De Representação', description: undefined, active: true, subTypes: [] },
					{ name: 'De Acompanhamento', description: undefined, active: true, subTypes: [] },
					{ name: 'Especial(1)', description: undefined, active: true, subTypes: [] },
					{ name: 'Especial(2)', description: undefined, active: true, subTypes: [] },
				],
			},

			{
				name: 'Convocação de Autoridade',
				description: undefined,
				active: true,
				subTypes: [
					{ name: 'Autoridade(1)', description: undefined, active: true, subTypes: [] },
					{ name: 'Autoridade(2)', description: undefined, active: true, subTypes: [] },
					{ name: 'Secretário à Plenário', description: undefined, active: true, subTypes: [] },
					{ name: 'Secretário à Comissão(1)', description: undefined, active: true, subTypes: [] },
					{ name: 'Secretário à Comissão(2)', description: undefined, active: true, subTypes: [] },
				],
			},

			{
				name: 'Licença',
				description: undefined,
				active: true,
				subTypes: [
					{ name: 'Do Cargo', description: undefined, active: true, subTypes: [] },
					{ name: 'Licença(1)', description: undefined, active: true, subTypes: [] },
					{ name: 'licença(2)', description: undefined, active: true, subTypes: [] },
					{ name: 'Missão Cultural', description: undefined, active: true, subTypes: [] },
				],
			},

			{
				name: 'Homenagem e Pesar',
				description: undefined,
				active: true,
				subTypes: [
					{ name: 'Pesar(1)', description: undefined, active: true, subTypes: [] },
					{ name: 'Pesar(2)', description: undefined, active: true, subTypes: [] },
					{ name: 'Sessão Solene', description: undefined, active: true, subTypes: [] },
				],
			},
			{
				name: 'Odem do Dia',
				description: undefined,
				active: true,
				subTypes: [
					{ name: 'Inclusão de Proposição', description: undefined, active: true, subTypes: [] },
					{ name: 'Adiamento de Discussão(1)', description: undefined, active: true, subTypes: [] },
					{ name: 'Adiamento de Discussão(2)', description: undefined, active: true, subTypes: [] },
					{ name: 'Apreciação em Determinado Dia', description: undefined, active: true, subTypes: [] },
					{ name: 'Sessão Extraordinária', description: undefined, active: true, subTypes: [] },
					{ name: 'Inclusão na Odem do Dia', description: undefined, active: true, subTypes: [] },
					{ name: 'inversão de Pauta', description: undefined, active: true, subTypes: [] },
					{ name: 'Realização de Diligência', description: undefined, active: true, subTypes: [] },
				],
			},
			{
				name: 'Tramitação',
				description: undefined,
				active: true,
				subTypes: [
					{
						name: 'Relacionado à Comissão',
						description: undefined,
						active: true,
						subTypes: [
							{ name: 'Distribuição de Proposição', description: undefined, active: true, subTypes: [] },
							{ name: 'Exame de outra Comissão', description: undefined, active: true, subTypes: [] },
							{ name: 'Prorrogação de Prazo(1)', description: undefined, active: true, subTypes: [] },
							{ name: 'Prorrogação de Prazo(2)', description: undefined, active: true, subTypes: [] },
							{ name: 'Tramitação Conjunta(1)', description: undefined, active: true, subTypes: [] },
							{ name: 'Tramitação Conjunta(2)', description: undefined, active: true, subTypes: [] },
						],
					},
					{ name: 'Desapensação de Proposição', description: undefined, active: true, subTypes: [] },
					{ name: 'Desarquivamento', description: undefined, active: true, subTypes: [] },
					{ name: 'Extinção de Urgência', description: undefined, active: true, subTypes: [] },
					{ name: 'Juntada de Documentos', description: undefined, active: true, subTypes: [] },
					{ name: 'Pedido de Vista', description: undefined, active: true, subTypes: [] },
					{ name: 'Retirada de Proposição', description: undefined, active: true, subTypes: [] },
					{ name: 'Sobrestamento de Estudo', description: undefined, active: true, subTypes: [] },
					{ name: 'Rito especial', description: undefined, active: true, subTypes: [] },
					{ name: 'Urgência', description: undefined, active: true, subTypes: [] },
				],
			},
			{
				name: 'Votação',
				description: undefined,
				active: true,
				subTypes: [
					{ name: 'Aplausos', description: undefined, active: true, subTypes: [] },
					{ name: 'Censura', description: undefined, active: true, subTypes: [] },
					{ name: 'Destaque', description: undefined, active: true, subTypes: [] },
					{ name: 'Globo', description: undefined, active: true, subTypes: [] },
					{ name: 'Em Separado(1)', description: undefined, active: true, subTypes: [] },
					{ name: 'Em Separado(2)', description: undefined, active: true, subTypes: [] },
					{ name: 'Nominal', description: undefined, active: true, subTypes: [] },
				],
			},

			{ name: 'Audiência Pública', description: undefined, active: true, subTypes: [] },

			{ name: 'Adiantamento de Formalidade', description: undefined, active: true, subTypes: [] },

			{ name: 'Prorrogação de Posse', description: undefined, active: true, subTypes: [] },

			{ name: 'Suspensão de Reunião', description: undefined, active: true, subTypes: [] },
		],
	},
];

export async function up(knex: Knex): Promise<void> {
	await knex.schema.dropTable('types');
	await knex.schema.createTable('types', (table: Knex.TableBuilder) => {
		table.increments('id').primary();
		table.string('name', 155).notNullable();
		table.boolean('active').notNullable().defaultTo(true);
		table.binary('description').nullable();
		table.integer('parent_id').unsigned().references('id').inTable('types').nullable();
	});
}

export async function down(knex: Knex): Promise<void> {}
