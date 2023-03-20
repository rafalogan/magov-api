import { convertBlobToString, convertToDate, setInstanceId } from 'src/utils';
import { IUnitExpensePaymentModel, IUnitExpenseSupplier, IUnitExpenseTask, IUnitExpenseViewModel } from '../types';
import { FileEntity } from '../entities';

export class UnitExpenseViewModel {
	id?: number;
	expense: string;
	description?: string;
	dueDate: Date;
	amount: number;
	type?: string;
	supplier?: IUnitExpenseSupplier;
	task?: IUnitExpenseTask;
	active: boolean;
	unitId: number;
	tenancyId: number;
	invoice: FileEntity;
	paymants?: IUnitExpensePaymentModel[];

	constructor(data: IUnitExpenseViewModel, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.expense = data.expense.trim();
		this.description = convertBlobToString(data.description);
		this.dueDate = convertToDate(data.dueDate);
		this.amount = Number(data.amount);
		this.active = !!data.active;
		this.type = data.type?.trim();
		this.supplier = this.setSupplier(data?.supplier);
		this.task = this.setTask(data?.task);
		this.unitId = Number(data.unitId);
		this.invoice = new FileEntity(data.invoice);
		this.tenancyId = Number(data.tenancyId);
		this.paymants = this.setPaymants(data.payments);
	}

	private setSupplier(value?: IUnitExpenseSupplier) {
		if (!value) return undefined;

		return { id: setInstanceId(value?.id), name: value?.name?.trim() };
	}

	private setTask(value?: IUnitExpenseTask) {
		return !value ? undefined : { id: setInstanceId(value.id), title: value.title.trim() };
	}

	private setPaymants(data?: IUnitExpensePaymentModel[]) {
		if (!data) return undefined;

		return data.map(i => ({
			paymentForm: i.paymentForm,
			value: Number.isInteger(i.value) ? Number(i.value) / 100 : i.value,
			installments: Number(i.installments),
		}));
	}
}
