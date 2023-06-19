import { clearString, convertBlobToString, convertToDate, setInstanceId, setValueNumberToDadaBase } from 'src/utils';
import { ISaleModel, ISaleProduct } from '../types';
import { FileEntity } from '../entities';
import { onLog } from 'src/core/handlers';

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
		this.products = this.setPoducts(data?.products);
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

	private setPoducts(products: any): ISaleProduct[] {
		const res: ISaleProduct[] = [];
		products = typeof products === 'string' ? JSON.parse(products) : products;
		onLog('raw products', products);

		for (const data of products) {
			onLog('data to parse', data);

			res.push({ ...data, id: Number(data.id), value: setValueNumberToDadaBase(data.amount), amount: Number(data.amount) });
		}

		return res;
	}
}
