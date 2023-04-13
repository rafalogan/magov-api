import { Knex } from 'knex';

export interface Knexfile {
	client: string;
	connection: string | knexConnection;
	migrations?: KnexMigrationConfig;
	pool?: KnexPoolConfig;
	useNullAsDefault?: boolean;
}

export interface knexConnection {
	database?: string;
	user?: string;
	password?: string;
	host?: string;
	port?: number;
	filename?: string;
	domain?: string;
	instanceName?: string;
	debug?: boolean;
	requestTimeout?: number;
}

export interface KnexMigrationConfig {
	database?: string;
	directory?: string | readonly string[];
	extension?: string;
	stub?: string;
	tableName?: string;
	schemaName?: string;
	disableTransactions?: boolean;
	disableMigrationsListValidation?: boolean;
	sortDirsSeparately?: boolean;
	loadExtensions?: readonly string[];
	migrationSource?: KnexMigrationSource<unknown>;
	name?: string;
}

export interface KnexPoolConfig {
	name?: string;
	afterCreate?: Function;
	min?: number;
	max?: number;
	refreshIdle?: boolean;
	idleTimeoutMillis?: number;
	reapIntervalMillis?: number;
	returnToHead?: boolean;
	priorityRange?: number;
	log?: (message: string, logLevel: string) => void;

	// tarn configs
	propagateCreateError?: boolean;
	createRetryIntervalMillis?: number;
	createTimeoutMillis?: number;
	destroyTimeoutMillis?: number;
	acquireTimeoutMillis?: number;
}

export interface KnexMigrationSource<TMigrationSpec> {
	getMigrations(loadExtensions: readonly string[]): Promise<TMigrationSpec[]>;
	getMigrationName(migration: TMigrationSpec): string;
	getMigration(migration: TMigrationSpec): Promise<KnexMigrationConf>;
}

export interface KnexMigrationConf {
	up: (knex: Knex) => PromiseLike<any>;
	down?: (kenx: Knex) => PromiseLike<any>;
}
