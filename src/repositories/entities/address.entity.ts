import { IAddress } from '../types';

export class Address {
	id?: number;
	cep: string;
	street: string;
	number?: number;
	complement?: string;
	district: string;
	city: string;
	uf: string;

	constructor(data: IAddress, id?: number) {
		Object.assign(this, data);

		this.id = Number(id || data.id) || undefined;
		this.number = Number(data.number) || 0;
	}
}
