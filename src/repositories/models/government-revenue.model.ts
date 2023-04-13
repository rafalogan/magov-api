import { convertBlobToString, convertToDate, setInstanceId, setValueNumberToView } from 'src/utils';
import { IGovernmentRevenueModel, IPropositionExpensesGovernment } from '../types';

export class GovernmentRevenueModel {
	id?: number;
	typeOfRecipe: string;
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
	propositions: IPropositionExpensesGovernment[];

	constructor(data: IGovernmentRevenueModel, id?: number) {
		this.id = setInstanceId(id || data?.id);
		this.typeOfRecipe = data.typeOfRecipe.trim();
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
		this.propositions = data.propositions;
	}
}
