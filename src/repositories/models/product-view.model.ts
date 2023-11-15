import { setInstanceId, setValueNumberToView } from 'src/utils';
import { IProduct } from '../types';

export class ProductViewModel {
	id?: number;
	name?: string;
	limit?: number;
	amount: number;
	typeId: number;
	type: string;
	value: number;

	constructor(data: IProduct, id?: number) {
		this.id = setInstanceId(id || data?.productId || data.id);
		this.name = data.name?.trim();
		this.limit = setInstanceId(data.limit);
		this.amount = Number(data.amount) || 1;
		this.typeId = Number(data.typeId);
		this.value = setValueNumberToView(data.value) as number;
	}
}
