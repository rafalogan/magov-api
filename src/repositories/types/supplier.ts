import { IID } from './shared';

export interface ISupplier extends IID {
	name: string;
	description?: Blob | string;
	tenancyId: number;
}
