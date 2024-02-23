import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as process from 'process';

export const corsOptions = (options?: CorsOptions): CorsOptions => ({
	origin: process.env.CORS_ORIGIN,
	methods: process.env.CORS_METHODS,
	preflightContinue: process.env.CORS_PREFLIGHT_CONTIME === 'true',
	optionsSuccessStatus: Number(process.env.CORS_OPTIONS_SUCCESS_STATUS) || 200,
	...options,
});
