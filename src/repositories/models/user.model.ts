import { clearString, hashString, setInstanceId } from 'src/utils';

import { IUnitModel, IUserModel, IUserPlan } from '../types';
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
	userRules: Array<string | number>;
	address: Address;
	plans?: IUserPlan[];
	unit?: UnitModel;
	image?: FileEntity;
	newTenancy?: boolean;

	constructor(data: IUserModel, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.firstName = data.firstName?.trim();
		this.lastName = data.lastName?.trim();
		this.email = data.email?.toLowerCase();
		this.password = data.confirmPassword ? hashString(data.password) : data.password;
		this.cpf = clearString(data.cpf);
		this.phone = clearString(data.phone);
		this.office = data.office?.trim();
		this.active = !!data.active;
		this.level = Number(data.level);
		this.unitId = setInstanceId(data.unitId);
		this.tenancyId = setInstanceId(data.tenancyId);
		this.userRules = this.setUserRules(data.userRules);
		this.address = new Address(data.address);
		this.plans = this.setUserPlans(data.plans);
		this.unit = this.setUserUit(data.unit, this.plans);
		this.image = data.image ? new FileEntity(data.image) : undefined;
		this.newTenancy = !!data.newTenancy;
	}

	private setUserRules(data?: Array<string | number>): Array<string | number> {
		if (!data) return [];

		return data.map(i => (Number(i) ? Number(i) : String(i)));
	}

	private setUserPlans(plans?: IUserPlan[]) {
		if (!Array.isArray(plans)) return undefined;
		return !plans?.length
			? undefined
			: plans.map(
				i =>
					({
						id: Number(i.id),
						amount: Number(i.amount) || 1,
					}) as IUserPlan
			);
	}

	private setUserUit(unit?: IUnitModel, plans?: IUserPlan[]) {
		if (!unit || typeof unit === 'string') return undefined;

		const products = unit.products?.length ? unit.products : plans ? plans : undefined;

		return new UnitModel({ ...unit, products });
	}
}
