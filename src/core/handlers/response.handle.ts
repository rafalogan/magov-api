import httpStatus, { INTERNAL_SERVER_ERROR, OK } from 'http-status';

import { onError, onWarn } from 'src/core/handlers/log.handler';
import { ErrorResponseParams, SucessResponseParams } from 'src/repositories/types';

export class ResponseHandle {
	static onSuccess(options: SucessResponseParams) {
		const { res, data, message } = options;
		const status = this.validateSatus(options?.status || data?.status) || OK;

		if (message) return res.status(status).json({ data, status: status || OK, message });
		return res.status(status || OK).json(data);
	}

	static onError(options: ErrorResponseParams) {
		const { res, message, err } = options;
		const status = this.validateSatus(options.status || err?.status) || INTERNAL_SERVER_ERROR;
		const sendMessage = !status || status === 500 ? 'internal server error' : message || err.message;

		this.setLog(status, sendMessage as string, err);
		return res.status(status).send({ status, message: sendMessage });
	}

	static setLog = (status: number, message: string, error?: Error) =>
		status >= 400 && status < 500 ? onWarn(message, error) : onError(message, error);

	static validateSatus(status: any) {
		const validHTTPStatus = Object.values(httpStatus);
		const value = Number(status);

		return value && validHTTPStatus.filter(i => i === value).length !== 0 ? value : undefined;
	}
}
