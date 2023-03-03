import { INTERNAL_SERVER_ERROR, OK } from 'http-status';

import { onError, onWarn } from 'src/core/handlers/log.handler';
import { ErrorResponseParams, SucessResponseParams } from 'src/repositories/types';

export class ResponseHandle {
	constructor() {}

	static onSuccess(options: SucessResponseParams) {
		const { res, data, status, message } = options;

		if (message) return res.status(status || OK).json({ data, status: status || OK, message });
		return res.status(status || OK).json(data);
	}

	static onError(options: ErrorResponseParams) {
		const { res, message, err, status } = options;
		const sts = status || err?.status || INTERNAL_SERVER_ERROR;
		const sendMessage = !sts || sts === 500 ? 'internal server error' : message;
		const msg = message || err?.message;

		this.setLog(sts, msg as string, err);
		return res.status(sts).send({ status, message: process.env.NODE_ENV?.includes('prod') ? sendMessage : msg });
	}

	static setLog = (status: number, message: string, error?: Error) =>
		status >= 400 && status < 500 ? onWarn(message, error) : onError(message, error);
}
