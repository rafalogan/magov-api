import { Logger } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { MorganInterceptor } from 'nest-morgan';

import { isDev } from 'src/utils';

const logger = new Logger('HTTP Request');
const stream = { write: (message: string) => logger.log(message.trim()) };
const format = isDev ? 'dev' : 'combined';

export const MorganProvider = {
	provide: APP_INTERCEPTOR,
	useClass: MorganInterceptor(format, { stream }),
};
