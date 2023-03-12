import { FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';

import { PropositonsType } from 'src/repositories/entities';
import { PropositonsTypeModel } from 'src/repositories/models';
import { IFile, IPropositonsType, IServiceOptions } from 'src/repositories/types';
import { convertDataValues, deleteFile, existsOrError, notExistisOrError } from 'src/utils';
import { DatabaseService } from './abistract-database.service';

export class PropositonsTypeService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: PropositonsTypeModel) {
		try {
			const fromDB = (await this.getPropositionsType(data.name)) as PropositonsTypeModel;
			notExistisOrError(fromDB?.id, { message: 'Type already exists', status: FORBIDDEN });

			const toSave = new PropositonsType({ ...data, active: true } as IPropositonsType);
			const [id] = await this.db('types').insert(convertDataValues(toSave));
			existsOrError(id, { message: 'Internal error', error: id, status: INTERNAL_SERVER_ERROR });

			const [fileId] = await this.db('files').insert(convertDataValues({ ...data.document, type_id: id }));
			existsOrError(fileId, { message: 'Internal error', error: fileId, status: INTERNAL_SERVER_ERROR });

			return { ...data, id, document: { ...data.document, id: fileId } };
		} catch (err) {
			return err;
		}
	}

	async update(data: PropositonsTypeModel, id: number) {
		try {
			const fromDB = (await this.getPropositionsType(id)) as PropositonsTypeModel;

			existsOrError(fromDB?.id, { message: 'Not found', status: NOT_FOUND });
			const toUpdate = new PropositonsType({ ...fromDB, ...data } as IPropositonsType);

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

			return this.db({ t: 'types', f: 'files' })
				.select({ id: 't.id', name: 't.name' }, { document_url: 'f.url' })
				.whereRaw('f.type_id = t.id')
				.then(res => {
					existsOrError(Array.isArray(res), { message: 'Internal error', status: INTERNAL_SERVER_ERROR });
					return res.map(i => convertDataValues(i, 'camel'));
				})
				.catch(err => err);
		} catch (err) {
			return err;
		}
	}

	async getPropositionsType(value: number | string) {
		try {
			const fromDB = await this.db({ t: 'types', f: 'files' })
				.select(
					{ id: 't.id', name: 't.name', description: 't.description' },
					{
						title: 'f.title',
						alt: 'f.alt',
						domument_name: 'f.name',
						filename: 'f.filename',
						type: 'f.type',
						url: 'f.url',
					}
				)
				.where('t.id', value)
				.andWhereRaw('f.type_id = t.id')
				.orWhere('t.name', value)
				.first();

			existsOrError(fromDB, { message: 'Not found', status: NOT_FOUND });
			existsOrError(fromDB?.id, { message: 'Internal error', status: INTERNAL_SERVER_ERROR });

			return new PropositonsTypeModel({
				...convertDataValues(fromDB, 'camel'),
				document: convertDataValues({ ...fromDB, name: fromDB.document_name }, 'camel'),
			});
		} catch (err) {
			return err;
		}
	}

	async desabled(id: number) {
		try {
			const fromDB = (await this.getPropositionsType(id)) as PropositonsTypeModel;
			existsOrError(fromDB?.id, { message: 'Type Not found', status: NOT_FOUND });

			const toDesabled = new PropositonsType({ ...fromDB, active: false } as IPropositonsType);
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
}
