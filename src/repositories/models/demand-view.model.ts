import { convertBlobToString, convertToDate, setInstanceId } from 'src/utils';
import { Keyword, Theme } from '../entities';
import { IDemandViewModel, IKeyword, ITheme } from '../types';
import { PlaintiffModel } from './plaintiff.model';

export class DemandViewModel {
	id?: number;
	name: string;
	description?: string;
	createdAt: Date;
	favorite?: boolean;
	level: number;
	active: boolean;
	deadLine: Date;
	status?: string;
	unitId: number;
	userId: number;
	plaintiff: PlaintiffModel;
	tenancyId: number;
	responsable: string;
	keywords: Keyword[];
	themes: Theme[];

	constructor(data: IDemandViewModel, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.name = data.name;
		this.description = convertBlobToString(data.description);
		this.createdAt = convertToDate(data.createdAt);
		this.favorite = !!data.favorite;
		this.level = data.level;
		this.active = !!data.active;
		this.deadLine = convertToDate(data.deadLine);
		this.status = data.status;
		this.unitId = data.unitId;
		this.userId = data.userId;
		this.responsable = `${data.userFirstName} ${data.userLastName}`;
		this.plaintiff = new PlaintiffModel({
			...data,
			name: data.plaintiff,
			id: data.plaintiffId,
			address: { ...data, id: undefined },
		});
		this.tenancyId = data.tenancyId;
		this.keywords = this.setKeywords(data.keywords);
		this.themes = this.setThemes(data.themes);
	}

	private setKeywords(value: IKeyword[]) {
		if (!value?.length) return [];
		return value.map(kw => new Keyword(kw));
	}

	private setThemes(value: ITheme[]) {
		if (!value?.length) return [];
		return value.map(th => new Theme(th));
	}
}
