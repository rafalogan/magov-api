import { DatabaseConfig, CacheConfig } from 'src/config';
import { ServerController } from 'src/core/controllers/server.controller';
import { onError } from 'src/core/handlers';

export class AppController {
	constructor(
		private server: ServerController,
		private databaseConfig: DatabaseConfig,
		private cacheConfig: CacheConfig
	) {}

	async init() {
		return this.databaseConfig
			.isConnected()
			.then(() => this.databaseConfig.latest())
			.then(() => this.cacheConfig.isConnect())
			.then(() => this.server.exec())
			.catch(err => onError('Falha ao inicar o Servidor', err));
	}
}
