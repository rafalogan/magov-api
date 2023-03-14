import { existsSync } from 'node:fs';
import { mkdir, unlink } from 'node:fs/promises';
import { resolve } from 'node:path';
import dotenv from 'dotenv';
import httpStatus from 'http-status';
import { Response } from 'express';
import { S3 } from 'aws-sdk';

import { DatabaseException, ResponseException } from 'src/utils/exceptions';
import { ResponseHandle } from 'src/core/handlers';
import { messages } from 'src/utils/messages';
import { ErrorResponseParams } from 'src/repositories/types';

const isValid = !process.env.NODE_ENV || process.env.NODE_ENV.toLowerCase().includes('dev');
export const isProd = () => process.env.NODE_ENV?.toLowerCase().includes('prod');

export const execDotenv = () => (isValid ? dotenv.config({ path: process.env.NODE_ENV === 'test' ? './.env.testing' : './.env' }) : null);

export const createUploadsDir = () => {
	const path = resolve(__dirname, '..', '..', 'tmp', 'uploads');
	const exists = existsSync(path);

	if (process.env.STORAGE_TYPE === 'local' && !exists) return mkdir(path, { recursive: true });
	return;
};

export const responseApi = (res: Response, data: any, status?: number) => {
	if (data instanceof ResponseException || data instanceof DatabaseException) {
		return responseApiError({ res, message: data.message, err: data.error, status: status || httpStatus.FORBIDDEN });
	}

	return ResponseHandle.onSuccess({ res, data, status: status || httpStatus.OK });
};

export const responseApiError = (options: ErrorResponseParams) => ResponseHandle.onError(options);

export const responseDataBaseUpdate = (response: any, data?: any) => {
	if (!response) return response;
	if (response.severity === 'ERROR') return new DatabaseException(response.detail ? response.detail : messages.noEdit);
	return { id: data.id, edit: response === 1, message: messages.successEdit, data };
};

export const responseDataBaseCreate = (response: any, data?: any) => {
	if (!response) return response;
	if (response.severity === 'ERROR') return new DatabaseException(`${messages.noSave}`, response);
	return { commad: response.command, rowCount: response.rowCount, message: messages.successSave, data };
};

export const responseNotFoundRegisters = new ResponseException(messages.notFoundRegister, {
	status: httpStatus.FORBIDDEN,
	message: messages.notFoundRegister,
});

export const deleteFile = (filename: string) => {
	const s3 = new S3();
	return process.env.STORAGE_TYPE?.toLowerCase() === 's3'
		? s3.deleteObject({ Bucket: process.env.AWS_BUCKET as string, Key: filename }).promise()
		: unlink(resolve(__dirname, '..', '..', 'tmp', 'uploads', filename));
};

export const setValueNumberToDadaBase = (value?: number) => {
	if (!value) return undefined;
	return Number.isInteger(value) ? Number(value) : Number(value) * 100;
};

export const setValueNumberToView = (value?: number) => {
	if (!value) return undefined;
	return Number.isInteger(value) ? value / 100 : value;
};
