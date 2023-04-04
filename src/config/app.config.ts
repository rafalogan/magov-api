import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { Logger } from 'winston';
import { Multer } from 'multer';

import { ICorsOptions } from 'src/repositories/types';
import { AuthConfig } from 'src/config/auth.config';
import { ModulesFactory, ServicesFactory } from 'src/factories';

export class AppConfig {
	private readonly _express: Application;
	private modules: ModulesFactory;
	private corsOptions: ICorsOptions = {
		origin: process.env.CORS_ORIGIN || '*',
		methods: process.env.CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE',
		preflightContinue: process.env.CORS_PREFLIGHT_CONTIME === 'true',
		optionsSuccessStatus: Number(process.env.CORS_OPTIONS_SUCCESS_STATUS) || 200,
	};

	constructor(private logger: Logger, private authConfig: AuthConfig, private services: ServicesFactory, private upload: Multer) {
		this._express = express();
		this.modules = new ModulesFactory(this.express, this.authConfig, this.services, this.upload);
		this.configExpress();
	}

	get express() {
		return this._express;
	}

	configExpress() {
		this.express.use(cors(this.corsOptions));
		this.express.use(this.morganConfig());
		this.express.use(bodyParser.urlencoded({ extended: false }));
		this.express.use(bodyParser.json());
		this.modules.exec();
	}

	private morganConfig() {
		const format = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test' ? 'dev' : 'combined';
		const stream = {
			write: (message: string) => this.logger.info(message.trim()),
		};

		return morgan(format, { stream });
	}
}
