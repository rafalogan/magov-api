import { convertBlobToString, convertToDate, setInstanceId } from 'src/utils';
import { IDemandModel } from '../types';
import { PlaintiffModel } from 'src/repositories/models/plaintiff.model';

export class DemandModel {
	id?: number;
	name: string;
	description: string;
	favorites?: boolean;
	level: number;
	active: boolean;
	deadLine: Date;
	status?: string;
	unitId: number;
	userId: number;
	plaintiff: PlaintiffModel;
	tenancyId: number;
	keywords: string[];
	themes: number[];

	constructor(data: IDemandModel, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.name = data.name.trim();
		this.description = convertBlobToString(data.description) as string;
		this.favorites = !!data.favorites;
		this.level = data.level;
		this.active = !!data.active;
		this.deadLine = convertToDate(data.deadLine);
		this.status = data.status?.trim();
		this.unitId = Number(data.unitId);
		this.userId = Number(data.userId);
		this.plaintiff = new PlaintiffModel(data.plantiff);
		this.tenancyId = data.tenancyId;
		this.keywords = data.keywords;
		this.themes = data.themes;
	}
}
