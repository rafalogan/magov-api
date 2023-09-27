import { Address, FileEntity } from '../entities';
import { IUserPlan, IUserRuleView, IUserUnit, IUserViewModel } from '../types';

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
	userRules: IUserRuleView[];
	tenancyId?: number;
	address?: Address;
	unit?: IUserUnit;
	plan?: IUserPlan;
	plans?: IUserPlan[];
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
		this.userRules = this.setUserRules(data.userRules);
		this.tenancyId = Number(data.tenancyId) || undefined;
		this.address = data.address ? new Address(data.address) : undefined;
		this.unit = data.unit;
		this.plan = data.plan;
		this.image = data.image ? new FileEntity(data.image) : undefined;
		this.plans = data.plans;
	}

	private setUserRules(data?: IUserRuleView[]): IUserRuleView[] {
		if (!data) return [];

		return data.map(i => ({
			screenId: Number(i.screenId),
			screenName: i.screenName?.trim(),
			ruleId: Number(i.ruleId),
			ruleName: i.ruleName?.trim(),
		}));
	}
}
