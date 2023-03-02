import { IAddress } from './address';
import { IID } from './shared';
import { ITenancyIdRequired } from './tenacy';

export interface IPlantiff extends IID, ITenancyIdRequired {
	name: string;
	birthday: Date | string;
	institute: string;
	cpfCnpj: string;
	relationshipsType: string;
	observation?: Blob | string;
	relatives?: string;
	voterRegistration?: string;
	parentId?: number;
	instituteTypeId: number;
}

export interface IPlantiffModel extends IPlantiff {
	instituteType: string;
	phone?: string;
	email?: string;
	address: IAddress;
}

export interface IPlantiffContact extends IID, ITenancyIdRequired {
	email: string;
	phone: string;
	plantiffId: number;
}
