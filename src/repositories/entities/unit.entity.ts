import { clearString, convertBlobToString, setInstanceId } from 'src/utils';
import { IUnit } from '../types';

export class Unit {
	id?: number;
	name: string;
	description?: string;
	cnpj: string;
	phone: string;
	active: boolean;
	tenancyId: number;
	planId: number;

	constructor(data: IUnit, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.name = data.name?.trim();
		this.description = convertBlobToString(data?.description);
		this.cnpj = clearString(data.cnpj);
		this.phone = clearString(data.phone);
		this.active = !!data.active;
		this.tenancyId = Number(data.tenancyId);
		this.planId = Number(data.planId);
	}
}
