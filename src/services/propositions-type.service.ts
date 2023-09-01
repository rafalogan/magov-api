import { FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';

import { FileEntity, PropositionsType } from 'src/repositories/entities';
import { PropositionsTypeModel } from 'src/repositories/models';
import { IFile, IPropositionsType, IServiceOptions } from 'src/repositories/types';
import { convertBlobToString, convertDataValues, deleteFile, existsOrError, notExistisOrError } from 'src/utils';
import { DatabaseService } from './abistract-database.service';
import { onLog } from 'src/core/handlers';

export class PropositionsTypeService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: PropositionsTypeModel) {
		try {
			const fromDB = (await this.getPropositionsType(data.name)) as PropositionsTypeModel;
			notExistisOrError(fromDB?.id, { message: 'Type already exists', status: FORBIDDEN });

			const toSave = new PropositionsType({ ...data, active: true } as IPropositionsType);
			const [id] = await this.db('types').insert(convertDataValues(toSave));
			existsOrError(id, { message: 'Internal error', error: id, status: INTERNAL_SERVER_ERROR });

			const [fileId] = await this.db('files').insert(convertDataValues({ ...data.document, type_id: id }));
			existsOrError(fileId, { message: 'Internal error', error: fileId, status: INTERNAL_SERVER_ERROR });

			return { ...data, id, document: { ...data.document, id: fileId } };
		} catch (err) {
			return err;
		}
	}

	async update(data: PropositionsTypeModel, id: number) {
		try {
			const fromDB = (await this.getPropositionsType(id)) as PropositionsTypeModel;

			existsOrError(fromDB?.id, { message: 'Not found', status: NOT_FOUND });
			const toUpdate = new PropositionsType({ ...fromDB, ...data } as IPropositionsType);

			if (data?.document) {
				await this.deleteDocument(fromDB.id as number);
				await this.db('files').insert(convertDataValues({ ...data.document, typeId: fromDB.id }));
			}

			await this.db('types').where({ id }).update(convertDataValues(toUpdate));
			return { message: 'Type updated success', data: { ...fromDB, ...data } };
		} catch (err) {
			return err;
		}
	}

	async read(id?: number) {
		try {
			if (id) return this.getPropositionsType(id);

			return this.db('types')
				.then(res => {
					existsOrError(Array.isArray(res), { message: 'Internal error', status: INTERNAL_SERVER_ERROR });
					const result: any[] = [];
					for (const item of res) {
						const data = convertDataValues(item, 'camel');
						data.description = convertBlobToString(data.description);
						data.active = !!data.active;

						result.push(data);
					}

					return this.setVAlues(result);
				})
				.catch(err => err);
		} catch (err) {
			return err;
		}
	}

	async getPropositionsType(value: number | string) {
		try {
			const fromDB =
				typeof value === 'number' ? await this.db('types').where('id', value).first() : await this.db('types').where('name', value).first();

			existsOrError(fromDB, { message: 'Not found', status: NOT_FOUND });
			existsOrError(fromDB?.id, { message: 'Internal error', status: INTERNAL_SERVER_ERROR });

			const document = await this.getDocument(fromDB?.id);

			return new PropositionsTypeModel({
				...convertDataValues(fromDB, 'camel'),
				document,
			});
		} catch (err) {
			return err;
		}
	}

	async desabled(id: number) {
		try {
			const fromDB = (await this.getPropositionsType(id)) as PropositionsTypeModel;
			existsOrError(fromDB?.id, { message: 'Type Not found', status: NOT_FOUND });

			const toDesabled = new PropositionsType({ ...fromDB, active: false } as IPropositionsType);
			await this.db('types').where({ id: fromDB.id }).update(convertDataValues(toDesabled));

			return { message: 'Type Desabled successfully', data: { ...fromDB, active: false } };
		} catch (err) {
			return err;
		}
	}

	private async deleteDocument(id: number) {
		try {
			const fromDB = (await this.db('files').where({ type_id: id }).first()) as IFile;
			if (fromDB?.id) await this.db('files').where({ id: fromDB.id }).del();

			return deleteFile(fromDB.filename);
		} catch (err) {
			return err;
		}
	}

	private async getDocument(typeId: number) {
		try {
			const fromDB = await this.db('files').where({ type_id: typeId }).first();
			notExistisOrError(fromDB.severity === 'ERROR', { message: 'Internal error', err: fromDB, status: INTERNAL_SERVER_ERROR });

			if (fromDB?.id) return new FileEntity(convertDataValues(fromDB, 'camel'));

			return undefined;
		} catch (err) {
			return err;
		}
	}

	private setVAlues(data: any[], parentId?: number) {
		const rootItens = data.filter(i => !i.parentId);

		if (parentId) {
			return data
				.filter(i => i.parentId == parentId)
				.map(i => {
					i.subTypes = this.setVAlues(data, i.id);
					return i;
				});
		}

		if (rootItens.length !== 0) {
			return rootItens.map(i => {
				i.subTypes = this.setVAlues(data, i.id);
				return i;
			});
		}

		return [];
	}
}
