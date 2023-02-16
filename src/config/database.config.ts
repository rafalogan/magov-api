import knex, { Knex } from 'knex';

import { KnexConfig } from 'src/config';
import { onError, onInfo } from 'src/core/handlers';
import { TERMINAL_COLORS } from 'src/utils';

const { greenBg, black, reset, red, cyan } = TERMINAL_COLORS;

export class DatabaseConfig {
	private readonly _connection: Knex;

	constructor(private knexfile: KnexConfig) {
		this._connection = knex(this.knexfile as Knex.Config);
	}

	get connection() {
		return this._connection;
	}

	async isConnected() {
		return this.connection
			.raw('SELECT 1+1 AS result')
			.then(result => onInfo(`${greenBg + black}SUCCESS:${reset} Database is Connected Active: ${result ? cyan : red}${!!result}${reset}`))
			.catch((err: Error) => onError('FAIL Database is not Connected', err));
	}

	async latest() {
		return this.connection.migrate
			.latest(this.knexfile as Knex.MigratorConfig)
			.then(() => onInfo('Database is updated!'))
			.catch(err => onError('FAIL on updated Database.', err));
	}

	async rollback() {
		return this.connection.migrate
			.rollback(this.knexfile as Knex.MigratorConfig)
			.then(() => onInfo('Database is clear.'))
			.catch(err => onError('FAIL on clear database.', err));
	}
}
