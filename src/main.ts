import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { baseURL } from 'src/utils/utils';
import { corsOptions } from 'src/config/cors.config';
import { httpsOptions } from 'src/config';

const logger = new Logger('MAGOV API');
async function bootstrap() {
	const app = await NestFactory.create(AppModule, { httpsOptions: httpsOptions() });

	app.enableCors(corsOptions());
	app.useGlobalPipes(new ValidationPipe());

	await app.listen(process.env.APP_PORT || 3000);
	logger.log(`app started at ${baseURL()}`);
}
bootstrap();
