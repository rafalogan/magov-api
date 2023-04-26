import { clearString, convertBlobToString } from 'src/utils';
import { IUnitModel, IUnitProduct } from '../types';
import { Address } from 'src/repositories/entities';

export class UnitModel {
	id?: number;
	name: string;
	description?: string;
	cnpj: string;
	phone: string;
	tenancyId: number;
	active: boolean;
	address: Address;
	products?: IUnitProduct[];

	constructor(data: IUnitModel, id?: number) {
		this.id = Number(id || data.id) || undefined;
		this.name = data.name?.trim();
		this.description = convertBlobToString(data?.description);
		this.cnpj = clearString(data.cnpj);
		this.phone = clearString(data.phone);
		this.tenancyId = Number(data.tenancyId);
		this.active = !!data.active;
		this.address = new Address(data.address);
		this.products = this.setProducts(data?.products);
	}

	private setProducts(data?: IUnitProduct[]) {
		return data?.map(item => ({
			id: Number(item.id),
			name: item.name?.trim(),
			amount: Number(item.amount) || 1,
			limit: Number(item.limit) || undefined,
			plan: !!item.plan,
		}));
	}
}
