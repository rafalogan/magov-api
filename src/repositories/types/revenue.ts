import { IFile } from './file';
import { IID } from './shared';
import { ITenancyIdRequired } from './tenacy';

export interface IRevenue extends IID {
	revenue: string;
	receive: Date | string;
	description?: Blob | string;
	status: number;
	active: boolean;
	recurrent: boolean;
	documentUrl?: string;
	documentNumber?: string;
	value: number;
	unitId: number;
	originId: number;
	tenancyId: number;
	government: boolean;
}

export interface IGovernmentRevenue extends IID {
	typeOfRecipe: string;
	revenue: string;
	receive: Date | string;
	value: number;
	status: number;
	active: boolean;
	recurrent: boolean;
	documentNumber: string;
	description?: Blob | string;
	unitId: number;
	tenancyId: number;
	government: boolean;
}

export interface IGovernmentRevenueModel extends IGovernmentRevenue {
	propositions: IPropositionExpensesGovernment[];
}

export interface IGovernmentRevenueViewModel extends IID, ITenancyIdRequired {
	revenue: string;
	receive: Date | string;
	value: number;
	status: number;
	active: boolean;
	recurrent: boolean;
	documentNumber: string;
	description?: Blob | string;
	typeOfRecipe: string;
	unit: IUnitGovernmentRevenue;
	propositions: IPropositionExpensesGovernment[];
	region: string;
}

export interface IPropositionExpensesGovernment {
	id: number;
	title: string;
	expense: number;
}

export interface IUnitGovernmentRevenue {
	id: number;
	unit: string;
}

export interface ITypeOrRecipeRevenue {
	id: number;
	typeOrRecipe: string;
}

export interface IOrigin extends IID {
	origin: string;
	description?: Blob | string;
}

export interface IRevenueModel extends IRevenue {
	unit?: string;
	document?: IFile;
	origin?: IOrigin | string;
	government: boolean;
}
