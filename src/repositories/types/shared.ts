import { RedisClientType } from 'redis';
import { Knex } from 'knex';

export interface IID {
	id?: number;
}

export interface ICorsOptions {
	origin: string;
	methods: string | string[];
	preflightContinue: boolean;
	optionsSuccessStatus: number;
}

export interface IHttps {
	enable: boolean;
	certFilePath: string;
	keyFilePath: string;
}

export interface IServiceOptions {
	conn: Knex;
	cacheClient: RedisClientType;
	fields?: string[];
}

export interface IPaginationOptions {
	page?: number;
	limit?: number;
	orderBy?: string;
	order?: string;
}

export interface IReadOptions extends IPaginationOptions {
	unitId?: number;
	tenancyId?: number;
	all?: boolean;
}

export interface IPagination extends IPaginationOptions {
	page: number;
	limit: number;
	total: number;
}

export interface INotificationOption {
	field: any;
	message: string;
}

export interface IGetValuesOptions {
	tableIds: string;
	whereIds: string;
	fieldIds: string;
	value: number;
	table: string;
	fields: string[];
}
