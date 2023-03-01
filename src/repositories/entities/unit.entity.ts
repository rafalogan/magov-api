import { clearString, convertBlobToString } from 'src/utils';
import { IUnit } from '../types';

export class Unit {
	id?: number;
	name: string;
	description?: string;
	cnpj: string;
	phone: string;
	active: boolean;
	tenancyId: number;

	constructor(data: IUnit, id?: number) {
		this.id = Number(id || data.id) || undefined;
		this.name = data.name?.trim();
		this.description = convertBlobToString(data?.description);
		this.cnpj = clearString(data.cnpj);
		this.phone = clearString(data.phone);
		this.active = data.active || true;
		this.tenancyId = Number(data.tenancyId);
	}
}
