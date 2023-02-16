import httpStatus from 'http-status';

import { onError, onWarn } from 'src/core/handlers/log.handler';
import { ErrorResponseParams, SucessResponseParams } from 'src/repositories/types';

export class ResponseHandle {
	static status = httpStatus;

	constructor() {}

	static onSuccess(options: SucessResponseParams) {
		const { res, data, status, message, stack } = options;

		if (message) return res.status(status || this.status.OK).json({ data, status: status || this.status.OK, message });
		return res.status(status || this.status.OK).json(data);
	}

	static onError(options: ErrorResponseParams) {
		const { res, message, err, status } = options;

		this.setLog(status || httpStatus.INTERNAL_SERVER_ERROR, message, options?.err);
		return res.status(status || httpStatus.INTERNAL_SERVER_ERROR).send({ status, message });
	}

	static setLog(status: number, message: string, error?: Error) {
		return status >= 400 && status < 500 ? onWarn(message, error) : onError(message, error);
	}
}
