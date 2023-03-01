import { clearString, hashString } from 'src/utils';

import { IUserModel } from '../types';
import { Address, FileEntity } from 'src/repositories/entities';

export class UserModel {
	id?: number;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	cpf: string;
	phone: string;
	office: string;
	active: boolean;
	level: number;
	unitId?: number;
	tenancyId?: number;
	userRules: number[];
	address: Address;
	planId?: number;
	image?: FileEntity;

	constructor(data: IUserModel, id?: number) {
		this.id = Number(id || data.id) || undefined;
		this.firstName = data.firstName.trim();
		this.lastName = data.lastName.trim();
		this.email = data.email.toLowerCase();
		this.password = data.confirmPassword ? hashString(data.password) : data.password;
		this.cpf = clearString(data.cpf);
		this.phone = clearString(data.phone);
		this.office = data.office.trim();
		this.active = data.active || true;
		this.level = Number(data.level);
		this.unitId = Number(data.unitId) || undefined;
		this.tenancyId = Number(data.tenancyId) || undefined;
		this.userRules = data.userRules?.map(Number) || [];
		this.address = new Address(data.address);
		this.planId = Number(data.planId) || undefined;
		this.image = data.image ? new FileEntity(data.image) : undefined;
	}
}
