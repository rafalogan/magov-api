import { IKeyword } from './keyword';
import { IPlantiff, IPlantiffModel } from './plantiff';
import { IID, IReadOptions } from './shared';
import { ITenancyIdRequired } from './tenacy';
import { ITheme } from './theme';

export interface IDemand extends IID {
	name: string;
	description: string | Blob;
	favorites?: boolean;
	level: number;
	active: boolean;
	deadLine: Date | string;
	status?: string;
	createdAt: Date;
	unitId: number;
	userId: number;
	plaintiffId: number;
	tenancyId: number;
}

export interface IDemandModel extends IDemand, IPlantiff {
	plantiff: IPlantiffModel;
	keywords: string[];
	themes: string[];
}

export interface IDemandViewModel extends IID {
	name: string;
	description: string | Blob;
	favorites?: boolean;
	level: number;
	active: boolean;
	deadLine: Date | string;
	status?: string;
	unitId: number;
	userId: number;
	plaintiff: IPlantiffModel;
	tenancyId: number;
	keywords: IKeyword[];
	themes: ITheme[];
}

export interface IDemands extends IDemand {
	responsible: string;
	plaintiff: string;
	uf: string;
	city: string;
	district: string;
	tasks?: IDemanTask[];
}

export interface IDemanTask {
	id: number;
	title: string;
}
