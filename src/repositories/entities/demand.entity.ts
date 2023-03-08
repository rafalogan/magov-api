import { IDemand } from '../types';
import { convertBlobToString, convertToDate, setInstanceId } from 'src/utils';

export class Demand {
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
	plaintiffId: number;
	tenancyId: number;

	constructor(data: IDemand, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.name = data.name.trim();
		this.description = convertBlobToString(data.description) as string;
		this.favorites = !!data.favorites || undefined;
		this.level = Number(data.level);
		this.active = !!data.active;
		this.deadLine = convertToDate(data.deadLine);
		this.status = data.status?.trim();
		this.unitId = Number(data.unitId);
		this.userId = Number(data.userId);
		this.plaintiffId = Number(data.plaintiffId);
		this.tenancyId = Number(data.tenancyId);
	}
}
