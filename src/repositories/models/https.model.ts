import { readFileSync } from 'fs';

import { ServerOptions } from 'https';
import { IHttps } from '../types';

export class HttpsModel implements ServerOptions {
	key: string | Buffer | Array<string | Buffer>;
	cert: string | Buffer | Array<string | Buffer>;

	constructor(ssl: IHttps) {
		this.cert = readFileSync(ssl.certFilePath);
		this.key = readFileSync(ssl.keyFilePath);
	}
}
