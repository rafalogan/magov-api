import { IFile } from './file';
import { IID } from './shared';

export interface IRevenue extends IID {
	revenue: string;
	receive: Date | string;
	description?: Blob | string;
	status: number;
	active: boolean;
	recurrent: boolean;
	documentUrl?: string;
	documentNumber: string;
	value: number;
	unitId: number;
	originId: number;
	tenancyId: number;
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
}

export interface IGovernmentRevenueModel extends IGovernmentRevenue {
	propositions: IPropositionExpensesGovernment[];
}

export interface IPropositionExpensesGovernment {
	id: number;
	title: string;
	value: number;
}

export interface IOrigin extends IID {
	origin: string;
	description?: Blob | string;
}

export interface IRevenueModel extends IRevenue {
	unit?: string;
	document?: IFile;
	origin: IOrigin | string;
}
