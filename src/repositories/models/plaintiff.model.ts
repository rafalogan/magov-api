import { clearString, convertBlobToString, convertToDate, setInstanceId } from 'src/utils';
import { Address } from '../entities';
import { IPlantiffModel } from '../types';

export class PlaintiffModel {
	id?: number;
	name: string;
	birthday: Date;
	institute: string;
	cpfCnpj: string;
	relationshipsType: string;
	observation?: string;
	relatives?: string;
	voterRegistration?: string;
	phone: string;
	email: string;
	parentId?: number;
	instituteTypeId: number;
	address: Address;

	constructor(data: IPlantiffModel, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.name = data.name.trim();
		this.birthday = convertToDate(data.birthday);
		this.institute = data.institute.trim();
		this.cpfCnpj = clearString(data.cpfCnpj);
		this.relationshipsType = data.relationshipsType.trim();
		this.observation = convertBlobToString(data.observation);
		this.relatives = data.relatives?.trim();
		this.voterRegistration = data.voterRegistration ? clearString(data?.voterRegistration) : undefined;
		this.phone = clearString(data.phone);
		this.email = data.email.toLowerCase().trim();
		this.parentId = setInstanceId(data.parentId);
		this.instituteTypeId = Number(data.instituteTypeId);
		this.address = new Address(data.address);
	}
}
