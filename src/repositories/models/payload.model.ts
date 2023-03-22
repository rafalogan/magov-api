import { IPayload, IUserRule, IUserUnit } from '../types';
import { UserViewModel } from './user-view.model';

export class Payload {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	userRules: IUserRule[];
	tenancyId?: number | null;
	unit?: IUserUnit;
	iat: number;
	exp: number;

	constructor(data: UserViewModel | IPayload) {
		this.id = Number(data.id);
		this.firstName = data.firstName;
		this.lastName = data.lastName;
		this.email = data.email;
		this.userRules = data.userRules;
		this.tenancyId = data.tenancyId || null;
		this.unit = data.unit;
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
