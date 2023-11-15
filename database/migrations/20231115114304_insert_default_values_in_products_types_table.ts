import { Knex } from 'knex';

const values: { type: string; description?: string | Blob };

export async function up(knex: Knex): Promise<void> {}

export async function down(knex: Knex): Promise<void> {}
