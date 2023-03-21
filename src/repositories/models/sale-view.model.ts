import { convertBlobToString, convertToDate, setInstanceId, setValueNumberToView } from 'src/utils';
import { FileEntity } from '../entities';
import { IPaymentView, ISaleUnitView, ISaleUserView, ISeller, ISaleViewModel, IProduct, IFile } from '../types';
import { ProductViewModel } from './product-view.model';

export class SaleViewModel {
	id?: number;
	dueDate: Date;
	value: number;
	commissionValue: number;
	installments: number;
	description?: string;
	products: ProductViewModel[];
	payment: IPaymentView;
	unit: ISaleUnitView;
	user: ISaleUserView;
	seller: ISeller;
	contract: FileEntity;
	tenancyId: number;

	constructor(data: ISaleViewModel) {
		this.id = setInstanceId(data.id);
		this.dueDate = convertToDate(data.dueDate);
		this.value = setValueNumberToView(data.value) as number;
		this.commissionValue = setValueNumberToView(data.commissionValue) as number;
		this.installments = Number(data.installments);
		this.description = convertBlobToString(data.description);
		this.products = this.setProducts(data.products);
		this.payment = data.payment;
		this.unit = data.unit;
		this.user = data.user;
		this.seller = data.seller;
		this.contract = new FileEntity(data.contract as IFile);
		this.tenancyId = Number(data.tenancyId);
	}

	private setProducts(data: IProduct[]) {
		return data.map(i => new ProductViewModel(i, i.productId));
	}
}
