import type { Knex } from 'knex';
import { ITaskStatus } from 'src/repositories/types';

const status: ITaskStatus[] = [
	{
		status: 'Pendente',
		description: 'Para tarefas que devem ser finalizadas',
	},
	{
		status: 'Fazendo',
		description: 'Para tarefas em execução',
	},
	{
		status: 'Concluído',
		description: 'Para tarefas em terminadas',
	},
];

export async function up(knex: Knex): Promise<void> {
	return knex.batchInsert('tasks_status', status);
}

export async function down(knex: Knex): Promise<void> {
	return status.forEach(({ status }) => knex('task_status').where({ status }).del());
}
