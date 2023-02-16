import http from 'http';
import https from 'https';
import { Application } from 'express';

import { onError, onHttp } from 'src/core/handlers';
import { TERMINAL_COLORS } from 'src/utils';
import { HttpsModel } from 'src/repositories/models';
import { IHttps } from 'src/repositories/types';

const { green, reset } = TERMINAL_COLORS;

export class ServerController {
	private host = process.env.HOST || 'localhost';
	private port = Number(process.env.PORT) || 3000;
	private httpsEnable = process.env.ENABLE_HTTPS?.toLowerCase() === 'true';

	constructor(private express: Application) {}

	exec() {
		return this.httpsEnable ? this.createHttpsServer() : this.createHttpServer();
	}

	private createHttpServer() {
		return http
			.createServer(this.express)
			.listen(this.port)
			.on('listening', this.onServerUp.bind(this))
			.on('error', this.onServerError.bind(this));
	}

	private createHttpsServer() {
		const options = new HttpsModel({
			certFilePath: process.env.HTTPS_CERT_FILE || '',
			keyFilePath: process.env.HTTPS_KEY_FILE || '',
		} as IHttps);

		return https
			.createServer(options, this.express)
			.listen(this.port)
			.on('listening', this.onServerUp.bind(this))
			.on('error', this.onServerError.bind(this));
	}

	private onServerUp() {
		const prefix = this.httpsEnable ? 'https' : 'http';

		return onHttp('Server is up and running on:', `${green}${prefix}://${this.host}:${this.port}${reset}`);
	}

	private onServerError(error: NodeJS.ErrnoException) {
		return onError(`ERROR: On Server Inti: ${__filename}`, error);
	}
}
