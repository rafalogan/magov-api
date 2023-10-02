import { IID } from './shared';
import { ITenancyIdRequired } from './tenacy';

export interface IContact extends IID, ITenancyIdRequired {
	phone: string;
	email: string;
	active: boolean;
	plaintiffId: number;
}

export interface IContactModel {
	phone: string;
	email: string;
}

export interface IContactViewModel extends IContact {
	plaintiff: string;
	institute: string;
	instituteType: string;
	instituteTypeId: number;
	district: string;
	city: string;
	uf: string;
}
