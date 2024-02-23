import { Logger } from '@nestjs/common';
import { log } from 'console';

import { isDev } from 'src/utils/utils';

const enableDebug = process.env.DEBUG === 'true';

export const newLogger = (title: string) => new Logger(title);

export const onLog = (...args: any[]) => {
	if (isDev) return log(...args.slice(2));
	return;
};

export const onDebug = (title: string, ...args: any[]) => {
	if (enableDebug) {
		const logger = new Logger(title);
		return logger.debug(args[0], ...args.slice(1));
	}
};

export const onInfo = (title: string, ...args: any[]) => {
	const logger = new Logger(title);
	return logger.log(args[0], ...args.slice(1));
};

export const onError = (title: string, ...args: any[]) => {
	const logger = new Logger(title);
	return logger.error(args[0], ...args.slice(1));
};
