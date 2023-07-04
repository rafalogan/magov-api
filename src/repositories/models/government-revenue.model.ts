import { convertBlobToString, convertToDate, setInstanceId, setValueNumberToView } from 'src/utils';
import { IGovernmentRevenueModel, IPropositionExpensesGovernment } from '../types';

export class GovernmentRevenueModel {
	id?: number;
	origin: string;
	revenue: string;
	receive: Date;
	value: number;
	status: number;
	active: boolean;
	recurrent: boolean;
	documentNumber: string;
	description?: string;
	unitId: number;
	tenancyId: number;
	expenses: IPropositionExpensesGovernment[];

	constructor(data: IGovernmentRevenueModel, id?: number) {
		this.id = setInstanceId(id || data?.id);
		this.origin = data.origin?.trim();
		this.revenue = data.revenue.trim();
		this.receive = convertToDate(data.receive);
		this.value = setValueNumberToView(data.value) as number;
		this.status = data.status;
		this.active = data.active;
		this.recurrent = data.recurrent;
		this.documentNumber = data.documentNumber;
		this.description = convertBlobToString(data.description);
		this.unitId = data.unitId;
		this.tenancyId = data.tenancyId;
		this.expenses = this.setExpenses(data?.expenses);
	}

	private setExpenses(data?: IPropositionExpensesGovernment[]): IPropositionExpensesGovernment[] {
		if (!data) return [];

		return data?.map(i => ({ ...i, expense: i.expense * 100, reserveValue: i.reserveValue * 100 }));
	}
}
