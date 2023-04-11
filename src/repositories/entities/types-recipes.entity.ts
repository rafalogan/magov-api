import { convertBlobToString, setInstanceId } from 'src/utils';
import { ITypesRecipes } from '../types';

export class TypesRecipes {
	id?: number;
	origin: string;
	description?: string;
	government: boolean;

	constructor(data: ITypesRecipes, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.origin = data.origin.trim();
		this.description = convertBlobToString(data.description);
		this.government = !!data.government;
	}
}
