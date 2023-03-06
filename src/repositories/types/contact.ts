import { IID } from './shared';
import { ITenancyIdRequired } from './tenacy';

export interface IContact extends IID, ITenancyIdRequired {
	phone: string;
	email: string;
	plaintiffId: number;
}

export interface IContactModel {
	phone: string;
	email: string;
}
