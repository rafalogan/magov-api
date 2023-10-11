import { convertBlobToString, convertToDate, setInstanceId } from 'src/utils';
import { IProposition } from '../types';

export class Proposition {
	id?: number;
	title: string;
	menu?: string;
	deadline: Date;
	active: boolean;
	favorite?: boolean;
	expense?: number;
	parentId?: number;
	propositionUrl?: string;
	unitId: number;
	typeId: number;
	tenancyId: number;
	textEditor?: string;

	constructor(data: IProposition, id?: number) {
		this.id = setInstanceId(id || data?.id);
		this.title = data.title.trim();
		this.menu = convertBlobToString(data.menu) as string;
		this.deadline = convertToDate(data.deadline);
		this.active = !!data.active;
		this.favorite = !!data.favorite;
		this.expense = this.setExpense(data.expense);
		this.parentId = setInstanceId(data.parentId);
		this.unitId = Number(data.unitId);
		this.typeId = Number(data.typeId);
		this.tenancyId = Number(data.tenancyId);
		this.propositionUrl = data.propositionUrl || undefined;
		this.textEditor = convertBlobToString(data.textEditor);
	}

	private setExpense(value?: number) {
		if (!value) return undefined;
		return Number.isInteger(value) ? Number(value) : Number(value) * 100;
	}
}
