import { SalePaymentModel } from '../models';
import { IFile } from './file';
import { IID } from './shared';

export interface ISaleModel extends IID {
	userId: number;
	unitId: number;
	tenancyId: number;
	products: ISaleProduct[];
	seller: string;
	cpf: string;
	commission: number;
	commissionInstallments: number;
	dueDate: Date | string;
	paymentForm: string;
	value: number;
	installments: number;
	contract: IFile;
	description: Blob | string;
}

export interface ISaleProduct {
	id: number;
	name: string;
	plan: boolean;
	amount: number;
	value: number;
}

export interface ISaleViewModel extends IID {
	dueDate: Date | string;
	value: number;
	commissionValue: number;
	commissionInstallments: number;
	installments: number;
	description: Blob | string;
	products: ISaleProduct[];
	paymentForm: string;
	unit: ISaleUnitView;
	user: ISaleUserView;
	seller: ISeller;
	contract: IFile;
	tenancyId: number;
	payments: ISalePayments;
	status: string;
	commissionStatus: string;
}

export interface ISalePayments {
	contract: ISalePayment[] | SalePaymentModel[];
	commissions: ISalePayment[] | SalePaymentModel[];
}

export interface IContractView {
	title?: string;
	alt?: string;
	name: string;
	filename: string;
	type: string;
	url: string;
}

export interface ISaleUnitView {
	id: number;
	name: string;
	cnpj: string;
	cep: string;
	street: string;
	number?: number;
	complement?: string;
	district: string;
	city: string;
	uf: string;
}

export interface ISaleUserView {
	id: Number;
	name: string;
	email: string;
}

export interface IPaymentView {
	id: number;
	form: string;
}

export interface ISale extends IID {
	dueDate: Date | string;
	value: number;
	commissionValue: number;
	commissionInstallments: number;
	installments: number;
	description: Blob | string;
	paymentId: number;
	unitId: number;
	tenancyId: number;
	userId: number;
	sellerId: number;
}

export interface ISeller extends IID {
	seller: string;
	cpf: string;
}

export interface ISalePayment extends IID {
	payDate: Date | string;
	value: number;
	installment: number;
	type: string;
	commission: boolean;
	saleId: number;
}
