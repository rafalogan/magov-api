import { convertBlobToString, convertToDate, setInstanceId } from 'src/utils';
import { IPlantiff } from '../types';

export class Plaintiff {
	id?: number;
	name: string;
	birthday: Date;
	institute: string;
	cpfCnpj: string;
	relationshipsType: string;
	observation?: string;
	relatives?: string;
	voterRegistration?: string;
	parentId?: number;
	instituteTypeId: number;
	tenancyId: number;

	constructor(data: IPlantiff, id?: number) {
		this.id = setInstanceId(id || data.id);
		this.name = data.name;
		this.birthday = convertToDate(data.birthday);
		this.institute = data.institute;
		this.cpfCnpj = data.cpfCnpj;
		this.relationshipsType = data.relationshipsType;
		this.observation = convertBlobToString(data.observation);
		this.relatives = data.relatives;
		this.voterRegistration = data.voterRegistration;
		this.parentId = Number(data.parentId);
		this.instituteTypeId = Number(data.instituteTypeId);
		this.tenancyId = Number(data.tenancyId);
	}
}
