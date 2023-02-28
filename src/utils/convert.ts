import bcrypt from 'bcrypt';
import { Request } from 'express';
import { CustomFile } from 'src/repositories/types';
import { baseUrl } from 'src/utils/validate';

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

	keysCamel.forEach((key, i) => (res[key] = data[keys[i]]));

	return res;
};

export const convertBlobToString = (value: Blob | string): string => (typeof value === 'string' ? value : value.toString());

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

export const setReadOptions = (req: Request, cacheTime?: number, fields?: string[]): ReadOptions => {
	const id = Number(req.params.id);
	const page = Number(req.query.page);
	const limit = Number(req.query.limit);
	const order: OrderOptions | undefined =
		req.query.order || req.query.orderBy ? { by: req.query.order as string, type: req.query.orderBy as string } : undefined;

	return { id, page, limit, order, cacheTime, fields };
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

export const filterCategoryModelInterface = (value: any): ICategoryModel => ({
	id: Number(value.id),
	name: value.name,
	description: value.description,
	url: value.url,
	active: value.active,
	parentId: Number(value.parentId || value.parentid) || undefined,
	userId: Number(value.userId || value.userid) || undefined,
});

export const filterUpdatePasswordOptions = (value: any): UpdatePasswordOptions => ({
	email: value.email,
	oldPassword: value.oldPassword,
	password: value.password,
	confirmPassword: value.confirmPassword,
});

export const setCard = (data: IPayment | Payment): IPayCard => ({
	numero: data.numero,
	expiracao: data.expiracao,
	codigoSeguranca: data.codigoSeguranca,
	portador: setPortador(data),
});

export const filterEventToList = (item: EventRaw): IEvent => ({
	id: item.id,
	title: item.title,
	subtitle: item.subtitle || undefined,
	content: item.content.toString(),
	popularity: item.popularity,
	releaseDate: item.releasedate,
	voteAverage: item.voteaverage,
	voteCount: item.votecount,
	type: item.type,
	categoryId: item.categoryid,
	userId: item.userid || undefined,
	files: {
		poster: setFileEvent(item),
	},
});

export const filterEventComplete = (items: EventRaw[]) => ({
	id: items[0].id,
	title: items[0].title,
	subtitle: items[0].subtitle || undefined,
	content: items[0].content.toString(),
	popularity: items[0].popularity,
	releaseDate: items[0].releasedate,
	voteAverage: items[0].voteaverage,
	voteCount: items[0].votecount,
	type: items[0].type,
	files: setFilesToEvent(items),
	categoryId: items[0].categoryid,
	userId: items[0].userid || undefined,
});

const setFilesToEvent = (items: EventRaw[]): EventFiles => ({
	poster: setFileEvent(items.find(item => item.filelocation === 'poster') as EventRaw),
	cover: setFileEvent(items.find(item => item.filelocation === 'cover') as EventRaw),
	videos: items.filter(item => item.filetype.includes('video')).map(setFileEvent),
	gallery: items.filter(i => i.filetype.includes('image')).map(setFileEvent),
});

const setFileEvent = (item: EventRaw) => ({
	title: item.filetitle,
	alt: item.filealt ? item.filealt.toString() : undefined,
	name: item.filename,
	type: item.filetype,
	url: item.fileulr,
	location: item.filelocation,
});

const setPortador = (data: IPayment | Payment): IPayPortador => ({
	nome: data.nome,
	cpf: data.cpf,
});
