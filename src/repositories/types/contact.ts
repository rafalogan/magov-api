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
	demand?: string;
	plaintiff: string;
	institute: string;
	city: string;
	uf: string;
}
