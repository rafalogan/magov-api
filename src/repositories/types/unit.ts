import { IAddress } from './address';
import { IID } from './shared';

export interface IUnit extends IID {
	name: string;
	description?: Blob | string;
	cnpj: string;
	phone: string;
	tenancyId: number;
	active: boolean;
	address: IAddress;
}
