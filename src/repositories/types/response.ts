import { Knex } from 'knex';
import QueryBuilder = Knex.QueryBuilder;
import { Response } from 'express';

export interface ErrorResponseParams {
	res: Response;
	message?: string;
	err?: Error | any;
	status?: number;
	dirname?: string;
	filename?: string;
}

export interface SucessResponseParams {
	res: Response;
	data: any;
	status?: number;
	message?: string;
	stack?: string;
}

export interface ResponseRegisterItem {
	create: boolean;
	data: any;
	result: QueryBuilder;
}

export interface ValidateTokenResponse {
	valid: boolean;
	status?: number;
	message?: string;
	token?: string;
}

export type IResponseExepiton = Error;

export interface DataResponseError {
	column: string;
	value: any;
}
