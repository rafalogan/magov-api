import { Knex } from 'knex';
import { IRule } from 'src/repositories/types';

const rules: IRule[] = [
	{
		name: 'Apenas visualizar',
		description: 'Pode visualizar relatorios e resultados de buscas simples bem como listar dados e ver detalhes de registros.',
	},
	{
		name: 'Pode Editar',
		description:
			'Tem todos os previlegios para visualizar relatorios, registros e resultados de busca ver delahes dos registros e também pode editar registros criados por outros usuários mais avançados',
	},
	{
		name: 'Pode Criar',
		description: 'Tem todos os previlegios de visusualização e de Edição de registros e também pode criar novos registros.',
	},
	{
		name: 'Todas as permissões',
		description:
			'Tem todos os previlegios de listagem, edição, cadastro de registro, bem como tem previlegios para desabilitar e/ou deletar registros.',
	},
];

export async function up(knex: Knex): Promise<void> {
	return knex.batchInsert('rules', rules);
}

export async function down(knex: Knex): Promise<void> {
	return rules.forEach(i => knex('rules').where({ name: i.name }).del());
}
