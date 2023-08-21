import { Address, FileEntity } from '../entities';
import { IPayload, IUserPlan, IUserRule, IUserUnit } from '../types';
import { UserViewModel } from './user-view.model';

export class Payload {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	cpf: string;
	phone: string;
	office: string;
	active: boolean;
	level: number;
	address?: Address;
	userRules: IUserRule[];
	tenancyId?: number | null;
	unit?: IUserUnit;
	plans?: IUserPlan[];
	image?: FileEntity;
	iat: number;
	exp: number;

	constructor(data: UserViewModel | IPayload) {
		this.id = Number(data.id);
		this.firstName = data.firstName;
		this.lastName = data.lastName;
		this.email = data.email;
		this.cpf = data.cpf;
		this.phone = data.phone;
		this.office = data.office;
		this.active = !!data.active;
		this.level = Number(data.level);
		this.address = data.address;
		this.userRules = data.userRules;
		this.tenancyId = data.tenancyId || null;
		this.unit = data.unit;
		this.plans = data?.plans;
		this.image = data?.image;
		this.iat = 'iat' in data ? data.iat : this.now();
		this.exp = 'exp' in data ? data.exp : this.expires();
	}

	private now() {
		return Math.floor(Date.now() / 1000);
	}

	private expires() {
		return this.iat + 60 * 60 * 24;
	}
}
