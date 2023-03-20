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
	paymentId: number;
	tenancyId: number;
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
	amount: number;
	value: number;
}

export interface ISeller extends IID {
	seller: string;
	cpf: string;
}
