import { convertBlobToString, convertToDate, setInstanceId, setValueNumberToView } from 'src/utils';
import { IDemandModel } from '../types';
import { PlaintiffModel } from 'src/repositories/models/plaintiff.model';

export class DemandModel {
	id?: number;
	name: string;
	description: string;
	favorite?: boolean;
	level: number;
	active: boolean;
	deadLine: Date;
	status?: string;
	createdAt: Date;
	unitId: number;
	approximateIncome: number;
	userId: number;
	plaintiff: PlaintiffModel;
	tenancyId: number;
	keywords: string[];
	themes: string[];

	constructor(data: IDemandModel, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.name = data.name.trim();
		this.description = convertBlobToString(data.description) as string;
		this.favorite = !!data.favorite;
		this.level = data.level;
		this.active = !!data.active;
		this.deadLine = convertToDate(data.deadLine);
		this.createdAt = data.createdAt ? convertToDate(data.createdAt) : new Date();
		this.approximateIncome = setValueNumberToView(data.approximateIncome) as number;
		this.status = !data?.status ? undefined : typeof data.status === 'string' ? data?.status?.trim() : `${data.status}`;
		this.unitId = Number(data.unitId);
		this.userId = Number(data.userId);
		this.tenancyId = data.tenancyId;
		this.plaintiff = new PlaintiffModel({ ...data.plaintiff, tenancyId: this.tenancyId }, data.plaintiff?.id);
		this.keywords = data.keywords;
		this.themes = data.themes;
	}
}
