import { knexConnection, Knexfile, KnexMigrationConfig, KnexPoolConfig } from 'src/repositories/types';

export class KnexConfig implements Knexfile {
	client: string;
	connection: string | knexConnection;
	migrations?: KnexMigrationConfig;
	pool?: KnexPoolConfig;
	useNullAsDefault?: boolean;

	constructor() {
		this.client = process.env.DB_CLIENT || '';
		this.connection = this.setConnection();
		this.migrations = this.setMigrations();
		this.pool = this.setPool();
		this.useNullAsDefault = this.setUseNull();
	}

	private setConnection(): string | knexConnection {
		if (process.env.DB_CONNECTION_URL) return process.env.DB_CONNECTION_URL;

		return {
			database: process.env.DB_NAME,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT) || undefined,
			filename: process.env.DB_FILENAME,
		};
	}

	private setMigrations = (): KnexMigrationConfig => ({
		directory: process.env.DB_MIGRATION_DIRECTORY || './database/migrations',
		extension: process.env.DB_MIGRATION_EXTENSION || 'ts',
	});

	private setPool = (): KnexPoolConfig => ({
		min: Number(process.env.DB_POOL_MIN) || 2,
		max: Number(process.env.DB_POOL_MAX) || 20,
	});

	private setUseNull() {
		if (process.env.DB_USE_NULL_DEFAULT) return process.env.DB_USE_NULL_DEFAULT.toLowerCase() === 'true';
		return true;
	}
}
