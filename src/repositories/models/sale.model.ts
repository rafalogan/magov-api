import { clearString, convertBlobToString, convertToDate, setInstanceId, setValueNumberToDadaBase } from 'src/utils';
import { ISaleModel, ISaleProduct } from '../types';
import { FileEntity } from '../entities';

export class SaleModel {
	id?: number;
	userId: number;
	unitId: number;
	tenancyId: number;
	products: ISaleProduct[];
	seller: string;
	cpf: string;
	commission: number;
	commissionInstallments: number;
	dueDate: Date;
	paymentForm: string;
	value: number;
	installments: number;
	contract: FileEntity;
	description?: string;

	constructor(data: ISaleModel, id?: number) {
		this.id = setInstanceId(id || data?.id);
		this.userId = Number(data.userId);
		this.unitId = Number(data.unitId);
		this.tenancyId = Number(data.tenancyId);
		this.products = data.products;
		this.seller = data.seller.trim();
		this.cpf = clearString(data.cpf);
		this.commission = setValueNumberToDadaBase(data.commission) as number;
		this.commissionInstallments = Number(data.commissionInstallments) || 1;
		this.dueDate = convertToDate(data.dueDate);
		this.paymentForm = data.paymentForm.trim();
		this.value = setValueNumberToDadaBase(data.value) as number;
		this.installments = Number(data.installments) || 1;
		this.contract = new FileEntity(data.contract);
		this.description = convertBlobToString(data.description);
	}

	private setPoducts(products: ISaleProduct[]): ISaleProduct[] {
		return products?.map((product: ISaleProduct) => ({
			...product,
			id: Number(product.id),
			value: setValueNumberToDadaBase(product.value) as number,
			amount: Number(product.amount),
		}));
	}
}
