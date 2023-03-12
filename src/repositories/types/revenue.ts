import { IFile } from './file';
import { IID } from './shared';

export interface IRevenue extends IID {
	revenue: string;
	receive: Date | string;
	description?: Blob | string;
	status: number;
	active: boolean;
	documentUrl?: string;
	value: number;
	unitId: number;
	originId: number;
	tenancyId: number;
}

export interface IOrigin extends IID {
	origin: string;
	description?: Blob | string;
}

export interface IRevenueModel extends IRevenue {
	document?: IFile;
	origin: IOrigin;
}
