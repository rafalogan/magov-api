import { onLog } from 'src/core/handlers';
import { clearString, convertBlobToString, convertToDate, setInstanceId } from 'src/utils';
import { Address } from '../entities';
import { IPlantiffModel } from '../types';

export class PlaintiffModel {
	id?: number;
	name: string;
	birthday: Date;
	institute: string;
	active: boolean;
	cpfCnpj: string;
	relationshipType: string;
	observation?: string;
	relatives?: string;
	voterRegistration?: string;
	phone: string;
	email: string;
	parentId?: number;
	tenancyId?: number;
	instituteType: string;
	instituteTypeId: number;
	address: Address;

	constructor(data: IPlantiffModel, id?: number) {
		onLog('plantiff, data raw', data);
		this.id = setInstanceId(id || data?.id);
		this.name = data.name.trim();
		this.birthday = convertToDate(data.birthday);
		this.active = this.setActive(data.active);
		this.institute = data.institute.trim();
		this.cpfCnpj = clearString(data.cpfCnpj);
		this.relationshipType = data.relationshipType?.trim() as string;
		this.observation = convertBlobToString(data.observation);
		this.relatives = data.relatives?.trim();
		this.voterRegistration = data.voterRegistration ? clearString(data?.voterRegistration) : undefined;
		this.phone = clearString(data.phone);
		this.email = data.email.toLowerCase().trim();
		this.parentId = setInstanceId(data?.parentId);
		this.tenancyId = setInstanceId(data?.tenancyId);
		this.instituteType = data.instituteType?.trim();
		this.instituteTypeId = Number(data.instituteTypeId);
		this.address = new Address(data.address);
	}

	private setActive(value: boolean) {
		if (this.id) return value;

		return true;
	}
}
