import { setInstanceId, setValueNumberToView } from 'src/utils';
import { IProduct } from '../types';

export class ProductViewModel {
	id?: number;
	name?: string;
	limit?: number;
	amount: number;
	value: number;

	constructor(data: IProduct, id?: number) {
		this.id = setInstanceId(id || data.productId);
		this.name = data.name?.trim();
		this.limit = setInstanceId(data.limit);
		this.amount = Number(data.amount);
		this.value = setValueNumberToView(data.value) as number;
	}
}
