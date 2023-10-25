import bcrypt from 'bcrypt';
import { Request } from 'express';
import { CustomFile, IAddress, IFile } from 'src/repositories/types';
import { baseUrl } from 'src/utils/validate';
import { upperCaseFirstLetter } from './convert-date';
import isEmpty from 'is-empty';

export const snakeToCamel = (field: string): string => {
	let toArray = field.split('_');
	toArray = toArray.map((word, index) => {
		if (index >= 1) return word.charAt(0).toUpperCase() + word.slice(1);
		return word;
	});

	return toArray.join('');
};

export const camelToSnake = (field: string): string => {
	return field
		.replace(/([A-Z])/g, ' $1')
		.split(' ')
		.join('_')
		.toLowerCase();
};

export const convertDataValues = (data: any, to?: string) => {
	if (!data) return;
	const keys = Object.keys(data);
	const keysCamel = to === 'camel' ? keys.map(snakeToCamel) : keys.map(camelToSnake);
	const res: any = {};

	keysCamel.forEach((key, i) => {
		res[key] = data[keys[i]];

		if (!res[key]) {
			deleteField(res, key);
		}
	});

	return res;
};

export const clearString = (value: string): string => value?.replace(/\W/g, '').trim();

export const convertBlobToString = (value?: Blob | string): string | undefined => {
	if (!value) return undefined;
	return typeof value === 'string' ? value : value.toString();
};

export const hashString = (field: string, salt = Number(process.env.SALT_ROUNDS)) => bcrypt.hashSync(field, salt);

export const stringify = (...data: any[]) => data.map(item => item.toString()).join(' ');
export const stringifyObject = (data: any) => JSON.stringify(data);

export const convertToJson = (data: string) => JSON.parse(data);

export const setParamsOrder = (req: Request) => {
	const value = Number(req.params.id);
	let where;
	if (req.originalUrl.includes('user')) where = 'userId';
	if (req.originalUrl.includes('place')) where = 'placeId';

	return { where, value: value };
};

export const extractFieldName = (value: string) => {
	const toSnakeCase = camelToSnake(value);
	const [first, ...last] = toSnakeCase.split('_');

	return `${upperCaseFirstLetter(first)} ${last.join(' ')}`;
};

export const uppercaseFirstLetter = (value: string) => {
	const [first, ...last] = value.split('');

	return `${first.toUpperCase()}${last.join('')}`;
};

export const deleteField = (data: any, field: string) => Reflect.deleteProperty(data, field);

export const setTimestampFields = (data?: Date | string | number) => (data ? new Date(data) : undefined);

export const filterRawFile = (req: Request) => {
	const file = req.file as CustomFile;

	return {
		title: req.body.title,
		alt: req.body.alt,
		name: req.file?.originalname || req.body.videoId,
		filename: process.env.STORAGE_TYPE === 's3' ? file.key : req.file?.filename || req.body.videoId,
		type: req.file?.mimetype || req.body.type,
		url: setUrlToFile(req, file),
		location: req.body.location,
		eventId: req.body.eventId,
		categoryId: req.body.categoryId,
		userId: req.body.userId,
	};
};

const setUrlToFile = (req: Request, file: CustomFile): string => {
	if (req.body.videoId) return `https://www.youtube.com/watch?v=${req.body.videoId}`;
	return process.env.STORAGE_TYPE === 's3' ? file.location : `${baseUrl()}/media/${req.file?.filename}`;
};

export const setUserImage = (req: Request) => {
	if (!req.file || isEmpty(req.file)) return undefined;

	const image = req.body.image ?? { title: req.body.imageTitle, alt: req.body.imageAlt };
	const { title, alt } = image;
	const file = req.file as CustomFile;

	return {
		title,
		alt,
		name: file?.originalname,
		filename: process.env.STORAGE_TYPE?.toLowerCase() === 's3' ? file?.key : file?.filename,
		type: file?.mimetype,
		url: process.env.STORAGE_TYPE?.toLowerCase() === 's3' ? file?.location : `${baseUrl()}/media/${file.filename}`,
	} as IFile;
};

export const setFileToSave = (req: Request) => {
	if (!req.file) return undefined;

	const bodyFile = req.body.file ?? { title: req.body.fileTitle, alt: req.body.fileAlt };
	const { title, alt } = bodyFile;
	const file = req.file as CustomFile;

	return {
		title,
		alt,
		name: file?.originalname,
		filename: process.env.STORAGE_TYPE?.toLowerCase() === 's3' ? file?.key : file?.filename,
		type: file.mimetype,
		url: process.env.STORAGE_TYPE?.toLowerCase() === 's3' ? file?.location : `${baseUrl()}/media/${file.filename}`,
	} as IFile;
};

export const setAddress = (req: Request): IAddress => {
	if (req.body.address) return req.body.address;
	const { cep, street, number, complement, district, city, uf } = req.body;

	return { cep, street, number, complement, district, city, uf };
};

export const setInstanceId = (id?: number) => Number(id) || undefined;

export const clearDuplicateItems = (value: any[]) => value.filter((item, index) => value.indexOf(item) === index);

export const setPlansToUser = (req: Request) => {
	if (req.body.plans?.length) return req.body.plans;
	if (req.body?.planId) return [{ id: setInstanceId(req.body.planId) }];

	return undefined;
};
