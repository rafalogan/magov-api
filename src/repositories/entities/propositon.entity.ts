import { convertBlobToString, convertToDate, setInstanceId } from 'src/utils';
import { IPropositionModel } from '../types';

export class Propositon {
	id?: number;
	title: string;
	menu: string;
	deadline: Date;
	active: boolean;
	expense?: number;
	parentId?: number;
	unitId: number;
	typeId: number;
	tenancyId: number;

	constructor(data: IPropositionModel, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.title = data.title.trim();
		this.menu = convertBlobToString(data.menu) as string;
		this.deadline = convertToDate(data.deadline);
		this.active = !!data.active;
		this.expense = this.setExpense(data.expense);
		this.parentId = setInstanceId(data.parentId);
		this.unitId = Number(data.unitId);
		this.typeId = Number(data.typeId);
		this.tenancyId = Number(data.tenancyId);
	}

	private setExpense(value?: number) {
		if (!value) return undefined;
		return Number.isInteger(value) ? Number(value) : Number(value) * 100;
	}
}
