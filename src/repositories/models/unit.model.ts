import { clearString, convertBlobToString } from 'src/utils';
import { IUnitModel, IUnitPlan } from '../types';
import { Address } from 'src/repositories/entities';

export class UnitModel {
	id?: number;
	name: string;
	description?: string;
	cnpj: string;
	phone: string;
	tenancyId: number;
	active: boolean;
	address: Address;
	plan: IUnitPlan;

	constructor(data: IUnitModel, id?: number) {
		this.id = Number(id || data.id) || undefined;
		this.name = data.name?.trim();
		this.description = convertBlobToString(data?.description);
		this.cnpj = clearString(data.cnpj);
		this.phone = clearString(data.phone);
		this.tenancyId = Number(data.tenancyId);
		this.active = !!data.active;
		this.address = new Address(data.address);
		this.plan = data.plan;
	}
}
