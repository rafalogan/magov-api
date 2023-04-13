import knex, { Knex } from 'knex';

import { KnexConfig } from 'src/config';
import { onError, onInfo } from 'src/core/handlers';
import { TERMINAL_COLORS } from 'src/utils';

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
			.then(result =>
				onInfo(
					`${TERMINAL_COLORS.greenBg + TERMINAL_COLORS.black}SUCCESS:${TERMINAL_COLORS.reset} Database is Connected Active: ${
						result ? TERMINAL_COLORS.cyan : TERMINAL_COLORS.red
					}${!!result}${TERMINAL_COLORS.reset}`
				)
			)
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
