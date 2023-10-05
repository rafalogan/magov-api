import { IAddress } from './address';
import { IContactModel } from './contact';
import { IID } from './shared';
import { ITenancyIdRequired } from './tenacy';

export interface IPlantiff extends IID, ITenancyIdRequired {
	name: string;
	birthday: Date | string;
	institute: string;
	cpfCnpj: string;
	relationshipType?: string;
	observation?: Blob | string;
	relatives?: string;
	voterRegistration?: string;
	active: boolean;
	parentId?: number;
	instituteTypeId: number;
}

export interface IPlantiffModel extends IPlantiff, IContactModel {
	instituteType: string;
	address: IAddress;
}

export interface IPlantiffContact extends IID, ITenancyIdRequired {
	email: string;
	phone: string;
	plantiffId: number;
}
