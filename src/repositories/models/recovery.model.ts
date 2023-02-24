import { IUserRecovery } from '../types';

export class RecoveryModel {
	email: string;
	password: string;
	confirmPassword: string;

	constructor(data: IUserRecovery) {
		this.email = data.email;
		this.password = data.password;
		this.confirmPassword = data.confirmPassword;
	}
}
