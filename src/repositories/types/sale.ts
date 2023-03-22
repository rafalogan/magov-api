import { IFile } from './file';
import { IID } from './shared';
import { IUnitModel } from './unit';
import { IUserModel } from './user';

export interface ISaleModel extends IID {
	unit: IUnitModel;
	user?: IUserModel;
	products: IProduct[];
	seller: ISeller;
	dueDate: Date | string;
	value: number;
	commissionValue: number;
	installments: number;
	description: Blob | string;
	paymentForm: string;
	tenancyId: number;
	contract: IFile;
}

export interface ISaleViewModel extends IID {
	dueDate: Date | string;
	value: number;
	commissionValue: number;
	installments: number;
	description: Blob | string;
	products: IProduct[];
	payment: IPaymentView;
	unit: ISaleUnitView;
	user: ISaleUserView;
	seller: ISeller;
	contract: IFile;
	tenancyId: number;
	payments: ISalePayment[];
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
	phone: string;
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
	installments: number;
	description: Blob | string;
	paymentId: number;
	unitId: number;
	tenancyId: number;
	userId: number;
	sellerId: number;
}

export interface IProduct {
	productId: number;
	name?: string;
	limit?: number;
	amount: number;
	value: number;
}

export interface ISeller extends IID {
	seller: string;
	cpf: string;
}

export interface ISalePayment extends IID {
	payDate: Date | string;
	value: number;
	commission: boolean;
	saleId: number;
}
