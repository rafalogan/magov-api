import { convertBlobToString, convertToDate, setInstanceId, setValueNumberToView } from 'src/utils';
import { IProduct, ISaleModel, IUserModel } from '../types';
import { UnitModel } from './unit.model';
import { UserModel } from './user.model';
import { FileEntity, Seller } from '../entities';

export class SaleModel {
	id?: number;
	unit: UnitModel;
	user?: UserModel;
	products: IProduct[];
	seller: Seller;
	dueDate: Date;
	value: number;
	commissionValue: number;
	installments: number;
	description?: string;
	paymentForm: string;
	tenancyId: number;
	contract: FileEntity;

	constructor(data: ISaleModel, id?: number) {
		this.id = setInstanceId(id || data?.id);
		this.products = this.setPoducts(data.products);
		this.seller = new Seller(data.seller);
		this.dueDate = convertToDate(data.dueDate);
		this.value = setValueNumberToView(data.value) as number;
		this.commissionValue = setValueNumberToView(data.commissionValue) as number;
		this.installments = Number(data.installments) || 1;
		this.description = convertBlobToString(data.description);
		this.paymentForm = data.paymentForm.trim();
		this.tenancyId = Number(data.tenancyId);
		this.contract = new FileEntity(data.contract);
		this.unit = new UnitModel(data.unit);
		this.user = new UserModel({ ...data.user, unit: data.unit } as IUserModel);
	}

	private setPoducts(products: IProduct[]) {
		return products.map(
			(product: IProduct) =>
				({ productId: Number(product.productId), value: setValueNumberToView(product.value), amount: Number(product.amount) } as IProduct)
		);
	}
}
