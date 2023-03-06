import { IKeyword } from './keyword';
import { IPlantiff, IPlantiffModel } from './plantiff';
import { IID } from './shared';
import { ITheme } from './theme';

export interface IDemand extends IID {
	name: string;
	description: string | Blob;
	favorites?: boolean;
	level: number;
	active: boolean;
	deadLine: Date | string;
	status?: string;
	unitId: number;
	userId: number;
	plaintiffId: number;
	tenancyId: number;
}

export interface IDemandModel extends IDemand, IPlantiff {
	plantiff: IPlantiffModel;
	keywords: string[];
	themes: number[];
}

export interface IDemandViewModel {
	name: string;
	description: string;
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
