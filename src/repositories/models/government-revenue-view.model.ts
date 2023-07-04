import { convertBlobToString, convertToDate, setInstanceId } from 'src/utils';
import { IGovernmentRevenueViewModel, IPropositionExpensesGovernment, IUnitGovernmentRevenue } from '../types';
import isEmpty from 'is-empty';

export class GovernmentRevenueViewModel {
	id?: number;
	revenue: string;
	receive: Date;
	value: number;
	status: number;
	active: boolean;
	recurrent: boolean;
	documentNumber: string;
	description?: string;
	origin: string;
	unit: IUnitGovernmentRevenue;
	expenses: IPropositionExpensesGovernment[];
	region: string;
	tenancyId: number;

	constructor(data: IGovernmentRevenueViewModel, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.revenue = data.revenue.trim();
		this.receive = convertToDate(data.receive);
		this.value = data.value / 100;
		this.status = Number(data.status);
		this.active = !!data.active;
		this.recurrent = !!data.recurrent;
		this.documentNumber = data.documentNumber?.trim();
		this.description = convertBlobToString(data.description);
		this.origin = data.origin;
		this.unit = data.unit;
		this.expenses = this.setPropositions(data.expenses);
		this.region = data.region?.trim();
		this.tenancyId = Number(data.tenancyId);
	}

	private setPropositions(data?: IPropositionExpensesGovernment[]): IPropositionExpensesGovernment[] {
		if (!data || isEmpty(data)) return [];

		return data?.map(i => {
			const expense = i.expense / 100;
			const reserveValue = i.reserveValue / 100;
			return { ...i, expense, reserveValue };
		});
	}
}
