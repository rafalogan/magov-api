import { clearString, hashString, setInstanceId } from 'src/utils';

import { IUserModel, IUserPlan } from '../types';
import { Address, FileEntity } from 'src/repositories/entities';
import { UnitModel } from './unit.model';

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
	plans?: IUserPlan[];
	unit?: UnitModel;
	image?: FileEntity;

	constructor(data: IUserModel, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.firstName = data.firstName.trim();
		this.lastName = data.lastName.trim();
		this.email = data.email.toLowerCase();
		this.password = data.confirmPassword ? hashString(data.password) : data.password;
		this.cpf = clearString(data.cpf);
		this.phone = clearString(data.phone);
		this.office = data.office.trim();
		this.active = data.active || true;
		this.level = Number(data.level);
		this.unitId = setInstanceId(data.unitId);
		this.tenancyId = setInstanceId(data.tenancyId);
		this.userRules = data.userRules?.map(Number) || [];
		this.address = new Address(data.address);
		this.plans = this.setUserPlans(data.plans);
		this.unit = this.plans?.length && data.unit ? new UnitModel({ ...data.unit, plan: { id: this.plans[0].id, name: '' } }) : undefined;
		this.image = data.image ? new FileEntity(data.image) : undefined;
	}

	private setUserPlans(plans?: IUserPlan[]) {
		return !plans?.length ? undefined : plans.map(i => ({ id: Number(i.id), amount: Number(i.amount) || 1 } as IUserPlan));
	}
}
