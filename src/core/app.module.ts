import { Application } from 'express';

import { CacheConfig, DatabaseConfig } from 'src/config';
import { AppController, ServerController } from './controllers';

export class AppModule {
	private server: ServerController;
	private app: AppController;

	constructor(express: Application, databaseConfig: DatabaseConfig, cacheConfig: CacheConfig) {
		this.server = new ServerController(express);
		this.app = new AppController(this.server, databaseConfig, cacheConfig);
	}

	exec = () => this.app.init();
}
