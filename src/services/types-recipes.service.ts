import { FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';

import { IServiceOptions } from 'src/repositories/types';
import { DatabaseService } from './abistract-database.service';
import { TypesRecipes } from 'src/repositories/entities';
import { convertDataValues, existsOrError, notExistisOrError } from 'src/utils';

export class TypesRecipesService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: TypesRecipes) {
		try {
			const fromDB = (await this.getTypeRecipe(data.origin)) as any;
			notExistisOrError(fromDB?.id, { message: 'type recipe already exists', status: FORBIDDEN });
			notExistisOrError(fromDB?.err, fromDB);

			const toSave = { ...data, government: true };
			const [id] = await this.db('origins').insert(convertDataValues(toSave));
			existsOrError(Number(id), { message: 'Internal error', err: id, status: INTERNAL_SERVER_ERROR });

			return { message: 'Type Recipe successful saved', data: { ...toSave, id } };
		} catch (err) {
			return err;
		}
	}

	async update(data: TypesRecipes, id: number) {
		try {
			const fromDB = (await this.getTypeRecipe(id)) as TypesRecipes;
			existsOrError(fromDB?.id, fromDB);

			const toUpdate = new TypesRecipes({ ...fromDB, ...data }, id);
			await this.db('origins').update(toUpdate).where({ id });

			return { message: 'Type Recipe updated successfully', data: toUpdate };
		} catch (err) {
			return err;
		}
	}

	async read(id?: number) {
		try {
			if (Number(id)) return this.getTypeRecipe(id as number);

			const fromDB = await this.db('origins').where({ government: true });
			existsOrError(Array.isArray(fromDB), { message: 'Internal error', err: fromDB, status: INTERNAL_SERVER_ERROR });

			return fromDB.map(i => new TypesRecipes(convertDataValues(i, 'camel')));
		} catch (err) {
			return err;
		}
	}

	async getTypeRecipe(filter: number | string) {
		try {
			const fromDB = await this.db('origins').where('id', filter).orWhere('origin', filter).first();
			existsOrError(fromDB?.id, { message: 'Type Recipe not found', status: NOT_FOUND });
			notExistisOrError(fromDB.severity === 'ERROR', { message: 'Internal error', status: INTERNAL_SERVER_ERROR, err: fromDB });

			return new TypesRecipes(convertDataValues(fromDB, 'camel'));
		} catch (err) {
			return err;
		}
	}

	async delete(id: number) {
		try {
			const fromDB = (await this.getTypeRecipe(id)) as TypesRecipes;
			existsOrError(fromDB?.id, { message: 'type already deleted', status: FORBIDDEN });

			const revenues = await this.db('revenues').where('origin_id', id);
			notExistisOrError(revenues, { message: 'exists revenues for this type, it is not possible to delete this type', status: FORBIDDEN });

			await this.db('origins').where({ id }).del();

			return { message: `Type recipe nº ${id} deleted successfully`, data: fromDB };
		} catch (err) {
			return err;
		}
	}
}
