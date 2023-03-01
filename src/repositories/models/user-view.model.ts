import { Address, FileEntity } from '../entities';
import { IUserRule, IUserUnit, IUserViewModel } from '../types';

export class UserViewModel {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	cpf: string;
	phone: string;
	office: string;
	active: boolean;
	level: number;
	userRules: IUserRule[];
	tenancyId?: number;
	address: Address;
	unit: IUserUnit;
	image?: FileEntity;

	constructor(data: IUserViewModel) {
		this.id = Number(data.id);
		this.firstName = data.firstName.trim();
		this.lastName = data.lastName.trim();
		this.email = data.email.trim();
		this.password = data.password;
		this.cpf = data.cpf.trim();
		this.phone = data.phone.trim();
		this.office = data.office.trim();
		this.active = !!data.active;
		this.level = data.level;
		this.userRules = data.userRules || [];
		this.tenancyId = Number(data.tenancyId) || undefined;
		this.address = new Address(data.address);
		this.unit = data.unit;
		this.image = data.image ? new FileEntity(data.image) : undefined;
	}
}
