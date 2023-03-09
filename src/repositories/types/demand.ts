import { IKeyword } from './keyword';
import { IPlantiff, IPlantiffModel } from './plantiff';
import { IID } from './shared';
import { ITenancyIdRequired } from './tenacy';
import { ITheme } from './theme';

export interface IDemand extends IID, ITenancyIdRequired {
	name: string;
	description: string | Blob;
	favorite?: boolean;
	level: number;
	active: boolean;
	deadLine: Date | string;
	status?: string;
	createdAt: Date;
	unitId: number;
	userId: number;
	plaintiffId: number;
}

export interface IDemandModel extends IDemand, IPlantiff {
	plaintiff: IPlantiffModel;
	keywords: string[];
	themes: string[];
}

export interface IDemandViewModel extends IID {
	name: string;
	description: Blob | string;
	favorite: boolean;
	level: number;
	active: boolean;
	deadLine: Date | string;
	status?: string;
	createdAt: Date | string;
	unitId: number;
	userId: number;
	plaintiffId: number;
	tenancyId: number;
	plaintiff: string;
	birthday: Date | string;
	cpfCnpj: string;
	institute: string;
	relationshipType?: string;
	relatives?: string;
	voterRegistration?: string;
	parentId?: number;
	instituteTypeId: number;
	email: string;
	phone: string;
	cep: string;
	street: string;
	number?: number;
	complement?: string;
	district: string;
	city: string;
	uf: string;
	userFirstName: string;
	userLastName: string;
	keywords: IKeyword[];
	themes: ITheme[];
}

export interface IDemands extends IID {
	name: string;
	favorite: boolean;
	level: number;
	description: Blob | string;
	deadLine: Date | string;
	createdAt: Date | string;
	firstNameResponsible: string;
	lastNameResponsible: string;
	plaintiff: string;
	uf: string;
	city: string;
	district: string;
	tasks?: IDemanTask[];
	userId: number;
	plaintiffId: number;
}

export interface IDemanTask {
	id: number;
	title: string;
}
