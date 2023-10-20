import { Knex } from 'knex';

const defaultAddressUsers: any[] = [
	{
		cep: '72428245',
		street: 'Núcleo Rural Casa Grande Módulo 8 MA - 20',
		number: null,
		complement: null,
		district: 'Ponte Alta (Gama)',
		city: 'Brasília',
		uf: 'DF',
		user_id: 1,
	},
	{
		cep: '14402000',
		street: 'Av. presidente vargas',
		number: 3000,
		complement: null,
		district: 'Recanto do Itambé',
		city: 'Franca',
		uf: 'SP',
		user_id: 2,
	},
];

export async function up(knex: Knex): Promise<void> {
	return knex.batchInsert('adresses', defaultAddressUsers);
}

export async function down(knex: Knex): Promise<void> {
	return defaultAddressUsers.forEach(i => knex('adresses').where('user_id', i['user_id']).del());
}
