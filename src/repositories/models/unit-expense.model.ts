import { convertBlobToString, convertToDate, setInstanceId } from 'src/utils';
import { IUnitExpenseModel, IUnitExpenseSupplier, IUnitExpenseTask } from '../types';

export class UnitExpenseModel {
	id?: number;
	expense: string;
	description?: string;
	dueDate: Date;
	amount: number;
	value: number;
	installments: number;
	type?: string;
	supplier?: IUnitExpenseSupplier;
	task?: IUnitExpenseTask;
	unitId: number;
	tenancyId: number;

	constructor(data: IUnitExpenseModel, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.expense = data.expense.trim();
		this.description = convertBlobToString(data.description);
		this.dueDate = convertToDate(data.dueDate);
		this.amount = Number(data.amount);
		this.value = Number.isInteger(data.value) ? data.value / 100 : data.value;
		this.installments = Number(data.installments);
		this.type = data.type?.trim();
		this.supplier = this.setSupplier(data?.supplier);
		this.task = this.setTask(data?.task);
		this.unitId = Number(data.unitId);
		this.tenancyId = Number(data.tenancyId);
	}

	private setSupplier(value?: IUnitExpenseSupplier) {
		if (!value) return undefined;

		return { id: setInstanceId(value?.id), name: value?.name?.trim() };
	}

	private setTask(value?: IUnitExpenseTask) {
		return !value ? undefined : { id: setInstanceId(value.id), title: value.title.trim() };
	}
}
