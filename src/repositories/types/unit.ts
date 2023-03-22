import { IAddress } from './address';
import { IID } from './shared';

export interface IUnit extends IID {
	name: string;
	description?: Blob | string;
	cnpj: string;
	phone: string;
	tenancyId: number;
	planId: number;
	active: boolean;
	address: IAddress;
}

export interface IUnitModel extends IUnit {
	plan: IUnitPlan;
}

export interface IUnitPlan {
	id: number;
	name: string;
	amount?: number;
}
