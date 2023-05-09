import { logger } from 'src/server';
import { stringify } from 'src/utils/convert';
import { TERMINAL_COLORS } from 'src/utils/constants';

const noProd = process.env.NODE_ENV !== 'production';
const noHomolog = process.env.NODE_ENV !== 'homolog';
const isDebug = process.env.DEBUG === 'true';

const { cyan, cyanBg, black, reset, red, redBg, yellow, yellowBg, whiteBg } = TERMINAL_COLORS;

export const onLog = (...args: any[]) => {
	if (noProd && noHomolog) return console.log(`${cyanBg + black}[Log:]${reset}`, `${cyan} ${args[0]}${reset}`, ...args.slice(1));
	if (isDebug) return logger.log('log', `${args[0]}`, ...args.slice(1));
};

export const onError = (...args: any[]) =>
	noProd
		? console.error(`${redBg + black}[Error:]${reset}`, `${red}${args[0]}${reset}`, ...args.slice(1))
		: logger.error(`${args[0]}`, ...args.slice(1));

export const onWarn = (...args: any[]) =>
	noProd
		? console.warn(`${yellowBg + black}[Warn:]${reset}`, `${yellow}${args[0]}${reset}`, ...args.slice(1))
		: logger.warn(`${args[0]}`, ...args.slice(1));

export const onInfo = (...args: any[]) => logger.info(`${args[0]}`, ...args.slice(1));

export const onDebug = (...args: any[]) => {
	if (isDebug) return logger.debug(`${args[0]}`, ...args.slice(1));
	if (noProd && noHomolog) return console.log(`${whiteBg + black}[Debug:]${reset}`, ...args);
};

export const onHttp = (...args: any[]) => logger.http(stringify(...args));
