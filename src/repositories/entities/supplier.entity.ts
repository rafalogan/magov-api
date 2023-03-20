import { convertBlobToString, setInstanceId } from 'src/utils';
import { ISupplier } from '../types';

export class Supplier {
	id?: number;
	name: string;
	description?: string;
	tenancyId: number;

	constructor(data: ISupplier, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.name = data.name.trim();
		this.description = convertBlobToString(data.description);
		this.tenancyId = Number(data.tenancyId);
	}
}
