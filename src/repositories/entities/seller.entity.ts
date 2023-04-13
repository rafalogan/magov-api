import { clearString, setInstanceId } from 'src/utils';
import { ISeller } from '../types';

export class Seller {
	id?: number;
	seller: string;
	cpf: string;

	constructor(data: ISeller, id?: number) {
		this.id = setInstanceId(id || data?.id);
		this.seller = data.seller.trim();
		this.cpf = clearString(data.cpf);
	}
}
