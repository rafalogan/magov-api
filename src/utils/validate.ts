import isEmpty from 'is-empty';
import bcrypt from 'bcrypt';

import { DatabaseException, PaymentException, ResponseException } from 'src/utils/exceptions';
import { Credentials, UserViewModel } from 'src/repositories/models';
import { INotificationOption, IsMachValidateOptions } from 'src/repositories/types';
import { User } from 'src/repositories/entities';
import { NotificationContext } from 'src/core/handlers/notification-context.handle';

export const storage = process.env.STORAGE_TYPE;
export const baseUrl = () => {
	const prefix = process.env.ENABLE_HTTPS === 'true' ? 'https://' : 'http://';
	const host = process.env.HOST;
	const port = Number(process.env.PORT);

	return `${prefix}${host}:${port}`;
};

export const existsOrError = (value: any, message: any): void | ResponseException => {
	if (isEmpty(value)) throw message;
	if (!value) throw message;
	if (Array.isArray(value) && value.length === 0) throw message;
	if (typeof value === 'string' && !value.trim()) throw message;
	if (typeof value === 'number' && !Number(value)) throw message;
	if (value instanceof ResponseException || value instanceof DatabaseException) throw value;
};

export const notExistisOrError = (value: any, message: any) => {
	try {
		existsOrError(value, message);
	} catch (message) {
		return;
	}

	throw message;
};

export const equalsOrError = (valueA: any, valueB: any, message: any) => {
	if (valueA !== valueB) throw message;
};

export const isMatchOrError = (data: IsMachValidateOptions) => {
	if (!isMatch(data.credentials, data.user)) throw data.message;
};

export const isMatch = (credentials: Credentials, user: UserViewModel | User) => bcrypt.compareSync(credentials.password, user.password);

export const verifyData = (data: any) => {
	if (data instanceof DatabaseException || data instanceof ResponseException) throw data;
};

export const saleVerify = (data: any): void | DatabaseException => {
	if (data instanceof DatabaseException) throw data;
	if (data instanceof ResponseException) throw data;
	if (data instanceof PaymentException) throw data;
};

export const requiredFields = (options: INotificationOption[]) => {
	const context = new NotificationContext();

	options.forEach(option => {
		const message = existsOrNotficate(option);
		if (message) return context.addNotification(message);
	});

	if (context.hasNotifications()) return context.notifications;
};

const existsOrNotficate = (option: INotificationOption) => {
	const { field: value, message } = option;

	if (isEmpty(value)) return message;
	if (!value) return message;
	if (Array.isArray(value) && value.length === 0) return message;
	if (typeof value === 'string' && !value.trim()) return message;
	if (typeof value === 'number' && !Number(value)) return message;

	return undefined;
};

export const isDataInArray = (data?: any[]) => data?.length !== 0;
