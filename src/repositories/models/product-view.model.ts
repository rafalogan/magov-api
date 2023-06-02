import { setInstanceId, setValueNumberToView } from 'src/utils';
import { IProduct } from '../types';

export class ProductViewModel {
	id?: number;
	name?: string;
	limit?: number;
	amount: number;
	plan: boolean;
	value: number;

	constructor(data: IProduct, id?: number) {
		this.id = setInstanceId(id || data.productId || data.id);
		this.name = data.name?.trim();
		this.limit = setInstanceId(data.limit);
		this.amount = Number(data.amount);
		this.plan = !!data.plan;
		this.value = setValueNumberToView(data.value) as number;
	}
}
