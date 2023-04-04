import { IID } from './shared';

export interface IAddress extends IID {
	cep: string;
	street: string;
	number?: number;
	complement?: string;
	district: string;
	city: string;
	uf: string;
}
