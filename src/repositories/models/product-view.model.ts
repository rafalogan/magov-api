import { setInstanceId, setValueNumberToView } from 'src/utils';
import { IProduct } from '../types';

export class ProductViewModel {
	id?: number;
	amount: number;
	value: number;

	constructor(data: IProduct, id?: number) {
		this.id = setInstanceId(id || data.productId);
		this.amount = Number(data.amount);
		this.value = setValueNumberToView(this.value) as number;
	}
}
