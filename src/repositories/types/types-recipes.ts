import { IID } from './shared';

export interface ITypesRecipes extends IID {
	origin: string;
	description?: Blob | string;
	government: boolean;
}
