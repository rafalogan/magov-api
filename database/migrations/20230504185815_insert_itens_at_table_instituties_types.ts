import { Knex } from 'knex';

const data = [
	{ name: 'Cidadão', active: true },
	{ name: 'Empresa', active: true },
	{ name: 'Movimento ', active: true },
	{ name: 'Militância', active: true },
	{ name: 'Liderança', active: true },
	{ name: 'ONG', active: true },
	{ name: 'Orgãos Públicos', active: true },
	{ name: 'Partido', active: true },
	{ name: 'Político', active: true },
	{ name: 'Sindicato', active: true },
];

export async function up(knex: Knex): Promise<void> {
	return knex.batchInsert('institutes_types', data);
}

export async function down(knex: Knex): Promise<void> {
	return data.forEach(({ name }) => knex('institutes_types').where({ name }).del());
}
