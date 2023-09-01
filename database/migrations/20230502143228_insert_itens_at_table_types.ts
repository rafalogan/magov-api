import { Knex } from 'knex';
import { IPropositionsTypeViewModel } from 'src/repositories/types';

const modelsTypes: IPropositionsTypeViewModel[] = [
	{
		name: 'Comunicados',
		description: '',
		active: true,
		subTypes: [],
	},
	{
		name: 'Convênios',
		description: '',
		active: true,
		subTypes: [
			{
				name: 'MROSC',
				description: '',
				active: true,
				subTypes: [
					{
						name: 'Termo de Colaboração',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Acordo de Cooperação',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Lista de Verificação (Sem Compartilhamento Patrimônio)',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Lista de Verificação (Termo de Colaboração)',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Termo de Fomento',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Edital Colaboração',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Edital Fomento',
						description: '',
						active: true,
						subTypes: [],
					},
				],
			},
			{
				name: 'Contrato de Repasse',
				description: '',
				active: true,
				subTypes: [
					{
						name: 'Acordo de Cooperação',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Técnica',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Minuta de Repasse',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Plano de Trabalho Protocolo de Intenções (Sem Repasse)',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Plano de Trabalho Cooperação Técnica (Sem Repasse)',
						description: '',
						active: true,
						subTypes: [],
					},
				],
			},
			{
				name: 'Convênios',
				description: '',
				active: true,
				subTypes: [
					{
						name: 'Declaração de Regularidade',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Pagamento Precatórios',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Lista de Verificação',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Minuta Provisória',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Edital de Chamamento Público',
						description: '',
						active: true,
						subTypes: [],
					},
				],
			},
			{
				name: 'Termos de Execução',
				description: '',
				active: true,
				subTypes: [],
			},
			{
				name: 'Descentralizada',
				description: '',
				active: true,
				subTypes: [],
			},
		],
	},
	{
		name: 'Criação de Projeto',
		description: '',
		active: true,
		subTypes: [
			{
				name: 'Projeto de Lei Ordinária',
				description: '',
				active: true,
				subTypes: [],
			},
			{
				name: 'Projeto de Lei Complementar',
				description: '',
				active: true,
				subTypes: [],
			},
			{
				name: 'Projeto de Resolução',
				description: '',
				active: true,
				subTypes: [],
			},
			{
				name: 'Decreto Legislativo',
				description: '',
				active: true,
				subTypes: [],
			},
			{
				name: 'Projeto de Data Comemorativa',
				description: '',
				active: true,
				subTypes: [],
			},
			{
				name: 'Denominação de Próprio Público',
				description: '',
				active: true,
				subTypes: [],
			},
			{
				name: 'Declaração de utilidade',
				description: '',
				active: true,
				subTypes: [],
			},
			{
				name: 'Pública',
				description: '',
				active: true,
				subTypes: [],
			},
			{
				name: 'Doação de Imóvel',
				description: '',
				active: true,
				subTypes: [],
			},
		],
	},
	{
		name: 'Emenda',
		description: '',
		active: true,
		subTypes: [
			{
				name: 'Emendas Parlamentares Gerais',
				description: '',
				active: true,
				subTypes: [],
			},
			{
				name: 'Emenda de Lei Orgãnica',
				description: '',
				active: true,
				subTypes: [],
			},
			{
				name: 'Emenda Orçamentária',
				description: '',
				active: true,
				subTypes: [],
			},
			{
				name: 'PEC',
				description: '',
				active: true,
				subTypes: [],
			},
		],
	},
	{
		name: 'Indicação',
		description: '',
		active: true,
		subTypes: [],
	},
	{
		name: 'Licitação',
		description: '',
		active: true,
		subTypes: [
			{
				name: 'Atas',
				description: '',
				active: true,
				subTypes: [
					{
						name: 'Registro de Preços',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Engenharia',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Serviços Continuados Exclusivos',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Serviços Continuados Não Exclusivos',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Serviços não Continuados',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Serviços tecnologia - TIC',
						description: '',
						active: true,
						subTypes: [],
					},
				],
			},
			{
				name: 'Contratos',
				description: '',
				active: true,
				subTypes: [
					{
						name: 'Compras',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Serviços de Engenharia',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Serviços de Engenharia (comum)',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Projeto Básico de Engenharia',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Serviços Continuados Exclusivos',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Serviços Continuados Não Exclusivos',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Serviços tecnologia - TIC',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Serviços não Continuados',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Capacitação de Inexigibilidade Licitação',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Projeto Básico de Inexigibilidade Licitação',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Minuta de Dispensa Eletrônica',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Termo de Justificativa de Técnica Relevante',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Termo de Locação de Imóvel',
						description: '',
						active: true,
						subTypes: [],
					},
				],
			},
			{
				name: 'Editais',
				description: '',
				active: true,
				subTypes: [
					{
						name: 'Coleta Seletiva',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Pregão Compras',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Pregão Engenharia',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Serviços Continuados Exclusivos',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Serviços Continuados Não Exclusivos',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Serviços não Continuados',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Serviços tecnologia - TIC',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Tomada de Preços',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Convite',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Concorrência Engenharia',
						description: '',
						active: true,
						subTypes: [],
					},
				],
			},
			{
				name: 'Estudo Técnico Preliminar',
				description: '',
				active: true,
				subTypes: [],
			},
			{
				name: 'Lista de Verificação',
				description: '',
				active: true,
				subTypes: [
					{
						name: 'Adesão Sistema de Preços',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Aditamentos Contratuais',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Compras',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Serviços',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Engenharia',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Serviços tecnologia - TIC',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Contratação Direta',
						description: '',
						active: true,
						subTypes: [],
					},
				],
			},
			{
				name: 'RDC',
				description: '',
				active: true,
				subTypes: [
					{
						name: 'Verificação Obras',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Minuta Contratual',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Edital Obras',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Projeto Básico',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Lista de Verificação',
						description: '',
						active: true,
						subTypes: [],
					},
				],
			},
			{
				name: 'Termo Aditivo',
				description: '',
				active: true,
				subTypes: [
					{
						name: 'Prorrogação Contratual',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Alteração Quantitativa',
						description: '',
						active: true,
						subTypes: [],
					},
				],
			},
			{
				name: 'Termo de Referência',
				description: '',
				active: true,
				subTypes: [
					{
						name: 'Compras',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Engenharia',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Serviços Continuados Exclusivos',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Serviços Continuados Não Exclusivos',
						description: '',
						active: true,
						subTypes: [],
					},
					{
						name: 'Serviços não Continuados',
						description: '',
						active: true,
						subTypes: [],
					},
				],
			},
		],
	},
	{
		name: 'Moção',
		description: '',
		active: true,
		subTypes: [],
	},
	{
		name: 'Ofício',
		description: '',
		active: true,
		subTypes: [],
	},
	{
		name: 'Questão de Ordem',
		description: '',
		active: true,
		subTypes: [],
	},
	{
		name: 'Pareceres',
		description: '',
		active: true,
		subTypes: [],
	},
	{
		name: 'Recurso',
		description: '',
		active: true,
		subTypes: [],
	},
	{
		name: 'Requerimento',
		description: '',
		active: true,
		subTypes: [],
	},
];

const insertItem = async (knex: Knex, items: IPropositionsTypeViewModel[], parentId?: number): Promise<void> => {
	return items.forEach(async i => {
		const { name, description, active, subTypes } = i;
		if (subTypes?.length) {
			const [id] = await knex('types').insert({ name, description, active, parent_id: parentId });

			return insertItem(knex, subTypes, id);
		}

		return knex('types').insert({ name, description, active, parent_id: parentId });
	});
};

const delItem = async (knex: Knex, items: IPropositionsTypeViewModel[]): Promise<void> => {
	return items.forEach(async i => {
		if (i.subTypes?.length) return delItem(knex, i.subTypes);
		return knex('types').where('name', i.name).del();
	});
};

export async function up(knex: Knex): Promise<void> {
	return insertItem(knex, modelsTypes);
}

export async function down(knex: Knex): Promise<void> {
	return delItem(knex, modelsTypes);
}
