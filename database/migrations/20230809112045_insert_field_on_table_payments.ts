import { Knex } from 'knex';

const payments = [{ form: 'Empenho', description: 'Usado para recerber verbas governamentais' }];

export async function up(knex: Knex): Promise<void> {
	return knex.batchInsert('payments', payments);
}

export async function down(knex: Knex): Promise<void> {
	return payments.forEach(i => knex('payments').where('form', i.form).del());
}
