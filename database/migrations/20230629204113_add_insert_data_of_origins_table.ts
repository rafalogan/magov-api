import { Knex } from 'knex';

const data = [
	{ origin: 'Emenda Orçamentária', government: true },
	{ origin: 'Extra Orçamentária', government: true },
	{ origin: 'Originária(origem de atividade própria)', government: true },
	{ origin: 'Derivativa(tributos e multas)', government: true },
	{ origin: 'Transferências Obrigatórias Federal', government: true },
	{ origin: 'Transferências Obrigatórias Estadual', government: true },
	{ origin: 'Arrecadação de Imposto Municipal', government: true },
	{ origin: 'Outras Receitas', government: true },
];

export async function up(knex: Knex): Promise<void> {
	return knex.batchInsert('origins', data);
}

export async function down(knex: Knex): Promise<void> {
	return data.forEach(i => knex('origins').where('origin', i.origin).del());
}
