import isEmpty from 'is-empty';
import bcrypt from 'bcrypt';

import { DatabaseException, PaymentException, ResponseException } from 'src/utils/exceptions';
import { Credentials, UserModel } from 'src/repositories/models';
import { IsMachValidateOptions } from 'src/repositories/types';
import { User } from 'src/repositories/entities';

export const storage = process.env.STORAGE_TYPE;
export const baseUrl = () => {
	const prefix = process.env.ENABLE_HTTPS === 'true' ? 'https://' : 'http://';
	const host = process.env.HOST;
	const port = Number(process.env.PORT);

	return `${prefix}${host}:${port}`;
};

export const existsOrError = (value: any, message: string): void | ResponseException => {
	if (isEmpty(value)) throw new ResponseException(message);
	if (!value) throw new ResponseException(message);
	if (Array.isArray(value) && value.length === 0) throw new ResponseException(message);
	if (typeof value === 'string' && !value.trim()) throw new ResponseException(message);
	if (typeof value === 'number' && !Number(value)) throw new ResponseException(message);
	if (value instanceof ResponseException || value instanceof DatabaseException) throw value;
};

export const notExistisOrError = (value: any, message: string) => {
	try {
		existsOrError(value, message);
	} catch (message) {
		return;
	}

	throw new ResponseException(message);
};

export const equalsOrError = (valueA: any, valueB: any, message: string) => {
	if (valueA !== valueB) throw new ResponseException(message);
};

export const isMatchOrError = (data: IsMachValidateOptions) => {
	if (!isMatch(data.credentials, data.user)) throw new ResponseException(data.message);
};

export const isMatch = (credentials: Credentials, user: UserModel | User) => bcrypt.compareSync(credentials.password, user.password);

export const verifyData = (data: any) => {
	if (data instanceof DatabaseException || data instanceof ResponseException) throw data;
};

export const saleVerify = (data: any): void | DatabaseException => {
	if (data instanceof DatabaseException) throw data;
	if (data instanceof ResponseException) throw data;
	if (data instanceof PaymentException) throw data;
};
