import { hashString, setInstanceId } from 'src/utils';
import { IUser } from '../types';

export class User {
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

	constructor(data: IUser, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.firstName = data.firstName;
		this.lastName = data.lastName;
		this.email = data.email;
		this.password = data.confirmPassword ? hashString(data.password) : data.password;
		this.cpf = data.cpf;
		this.phone = data.phone;
		this.office = data.office;
		this.active = data.active;
		this.level = Number(data.level);
		this.unitId = Number(data.unitId) || undefined;
		this.tenancyId = Number(data.tenancyId) || undefined;
	}
}
