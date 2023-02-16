export interface IID {
	id?: number;
}

export interface ICorsOptions {
	origin: string;
	methods: string | string[];
	preflightContinue: boolean;
	optionsSuccessStatus: number;
}

export interface IHttps {
	enable: boolean;
	certFilePath: string;
	keyFilePath: string;
}
