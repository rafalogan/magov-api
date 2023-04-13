import { convertBlobToString, convertToDate, setInstanceId, setValueNumberToView } from 'src/utils';
import { IGovernmentRevenueViewModel, IPropositionExpensesGovernment, ITypeOrRecipeRevenue, IUnitGovernmentRevenue } from '../types';

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
	type: ITypeOrRecipeRevenue;
	unit: IUnitGovernmentRevenue;
	propositions: IPropositionExpensesGovernment[];
	region: string;
	tenancyId: number;

	constructor(data: IGovernmentRevenueViewModel, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.revenue = data.revenue.trim();
		this.receive = convertToDate(data.receive);
		this.value = setValueNumberToView(data.value) as number;
		this.status = Number(data.status);
		this.active = !!data.active;
		this.recurrent = !!data.recurrent;
		this.documentNumber = data.documentNumber.trim();
		this.description = convertBlobToString(data.description);
		this.type = data.type;
		this.unit = data.unit;
		this.propositions = this.setProprositions(data.propositions);
		this.region = data.region.trim();
		this.tenancyId = data.tenancyId;
	}

	private setProprositions(data: IPropositionExpensesGovernment[]) {
		if (!data?.length) return [];
		return data.map(i => {
			i.value = setValueNumberToView(i.value) as number;
			return i;
		});
	}
}
