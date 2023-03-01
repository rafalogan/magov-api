import { clearString } from 'src/utils';
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
		this.id = Number(id || data.id) || undefined;
		this.cep = clearString(data.cep);
		this.street = data.street?.trim();
		this.number = Number(data.number) || 0;
		this.complement = data.complement?.trim();
		this.district = data.district?.trim();
		this.city = data.city?.trim();
		this.uf = data.uf?.trim();
	}
}
