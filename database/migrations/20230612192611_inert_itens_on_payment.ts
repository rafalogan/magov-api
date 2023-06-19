import { Knex } from 'knex';

const paymentsFroms: any[] = [
	{ form: 'Débito', description: 'Forma de pagemento para compras no débito.' },
	{ form: 'Crédito', description: 'Forma de pagamento para compras no crédito' },
	{ form: 'Pix', description: 'Forma de pagamento para compras com pix' },
	{ form: 'Ted', description: null },
];

export async function up(knex: Knex): Promise<void> {
	return knex.batchInsert('payments', paymentsFroms);
}

export async function down(knex: Knex): Promise<void> {
	return paymentsFroms.forEach(i => knex('payments').where('form', i.form).del());
}
