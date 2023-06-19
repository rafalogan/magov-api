import { convertBlobToString, convertToDate, setInstanceId, setValueNumberToView } from 'src/utils';
import { FileEntity } from '../entities';
import { ISaleUnitView, ISaleUserView, ISeller, ISaleViewModel, IProduct, IFile, ISalePayments, ISaleProduct } from '../types';
import { SalePaymentModel } from './sale-payment.model';
import { onLog } from 'src/core/handlers';

export class SaleViewModel {
	id?: number;
	dueDate: Date;
	value: number;
	commissionValue: number;
	commissionInstallments: number;
	installments: number;
	description?: string;
	products: ISaleProduct[];
	paymentForm: string;
	unit: ISaleUnitView;
	user: ISaleUserView;
	seller: ISeller;
	contract: FileEntity;
	tenancyId: number;
	payments: ISalePayments;
	status: string;
	commissionStatus: string;

	constructor(data: ISaleViewModel) {
		this.id = setInstanceId(data.id);
		this.dueDate = convertToDate(data.dueDate);
		this.value = setValueNumberToView(data.value) as number;
		this.commissionValue = setValueNumberToView(data.commissionValue) as number;
		this.commissionInstallments = Number(data.commissionInstallments);
		this.installments = Number(data.installments);
		this.description = convertBlobToString(data.description);
		this.products = this.setProducts(data.products);
		this.paymentForm = data.paymentForm;
		this.unit = data.unit;
		this.user = data.user;
		this.seller = data.seller;
		this.contract = new FileEntity(data.contract as IFile);
		this.tenancyId = Number(data.tenancyId);
		this.payments = this.setPayments(data.payments);
		this.status = data.status;
		this.commissionStatus = data.commissionStatus;
	}

	private setPayments(data: ISalePayments): ISalePayments {
		const contract = data.contract?.map(i => (i instanceof SalePaymentModel ? i : new SalePaymentModel(i)));
		const commissions = data.commissions?.map(i => (i instanceof SalePaymentModel ? i : new SalePaymentModel(i)));

		return { contract, commissions };
	}

	private setProducts(data: ISaleProduct[]) {
		return data?.map(i => ({
			id: Number(i.id),
			name: i.name?.trim(),
			plan: !!i.plan,
			amount: Number(i.amount),
			value: setValueNumberToView(i.value) as number,
		}));
	}
}
