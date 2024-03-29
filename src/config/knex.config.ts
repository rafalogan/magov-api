import { Knex } from 'knex';

const connection = (options?: string | Knex.StaticConnectionConfig | Knex.ConnectionConfigProvider) => {
	if (process.env.DB_CONNECTION) return process.env.DB_CONNECTION;
	if (typeof options === 'string') return options;

	return {
		database: process.env.DB_NAME,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		host: process.env.DB_HOST,
		port: Number(process.env.DB_PORT) || undefined,
		filename: process.env.DB_FILENAME,
		...options,
	};
};

export const knexOptions = (options?: Knex.Config): Knex.Config => ({
	client: process.env.DB_CIENT || 'pg',
	connection: connection(options.connection),
	pool: {
		min: Number(process.env.DB_POOL_MIN) || 2,
		max: Number(process.env.DB_POOL_MAX) || 20,
	},
	useNullAsDefault: true,
	migrations: {
		directory: process.env.DB_MIGRATION_DIRECTORY || './database/migrations',
		extension: process.env.DB_MIGRATION_EXTENSION || 'ts',
	},
	...options,
});
