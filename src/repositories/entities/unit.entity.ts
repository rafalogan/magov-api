import { clearString, convertBlobToString } from 'src/utils';
import { IUnit } from '../types';
import { Address } from './address.entity';

export class Unit {
	id?: number;
	name: string;
	description?: string;
	cnpj: string;
	phone: string;
	tenancyId: number;
	address: Address;

	constructor(data: IUnit, id?: number) {
		this.id = Number(id || data.id) || undefined;
		this.name = data.name?.trim();
		this.description = convertBlobToString(data?.description);
		this.cnpj = clearString(data.cnpj);
		this.phone = clearString(data.phone);
		this.tenancyId = Number(data.tenancyId);
		this.address = new Address(data.address);
	}
}
