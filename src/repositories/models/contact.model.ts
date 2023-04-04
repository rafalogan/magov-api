import { setInstanceId } from 'src/utils';
import { IContactViewModel } from '../types';

export class ContactModel {
	id?: number;
	demand?: string;
	plaintiff: string;
	phone: string;
	email: string;
	istitution: string;
	institute: string;
	plaintiffId: number;
	tenancyId: number;

	constructor(data: IContactViewModel, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.demand = data?.demand;
		this.plaintiff = data.plaintiff.trim();
		this.phone = data.phone.trim();
		this.email = data.email.trim();
		this.istitution = `${data.city.trim()}-${data.uf.trim()}`;
		this.institute = data.institute.trim();
		this.plaintiffId = Number(data.plaintiffId);
		this.tenancyId = Number(data.tenancyId);
	}
}
