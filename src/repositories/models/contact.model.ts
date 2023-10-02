import { IContactViewModel } from '../types';

export class ContactModel {
	plaintiffId: number;
	plaintiff: string;
	phone: string;
	email: string;
	district: string;
	city: string;
	institute: string;
	instituteType: string;
	instituteTypeId: number;
	tenancyId: number;

	constructor(data: IContactViewModel) {
		this.plaintiffId = Number(data.plaintiffId);
		this.plaintiff = data.plaintiff?.trim();
		this.phone = data.phone?.trim();
		this.email = data.email?.trim();
		this.district = data.district?.trim();
		this.city = `${data.city.trim()}-${data.uf.trim()}`;
		this.institute = data.institute.trim();
		this.instituteType = data.instituteType?.trim();
		this.instituteTypeId = Number(data.instituteTypeId);
		this.tenancyId = Number(data.tenancyId);
	}
}
