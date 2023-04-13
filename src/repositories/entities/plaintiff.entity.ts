import { onLog } from 'src/core/handlers';
import { convertBlobToString, convertToDate, setInstanceId } from 'src/utils';
import { IPlantiff } from '../types';

export class Plaintiff {
	id?: number;
	name: string;
	birthday: Date;
	institute: string;
	cpfCnpj: string;
	relationshipType?: string;
	observation?: string;
	relatives?: string;
	voterRegistration?: string;
	active: boolean;
	parentId?: number;
	instituteTypeId: number;
	tenancyId: number;

	constructor(data: IPlantiff, id?: number) {
		onLog('raw Plantiff', data);

		this.id = setInstanceId(id || data.id);
		this.name = data.name;
		this.birthday = convertToDate(data.birthday);
		this.institute = data.institute;
		this.cpfCnpj = data.cpfCnpj;
		this.relationshipType = data.relationshipType;
		this.observation = convertBlobToString(data.observation);
		this.relatives = data.relatives;
		this.active = !!data.active;
		this.voterRegistration = data.voterRegistration;
		this.parentId = setInstanceId(data?.parentId);
		this.instituteTypeId = Number(data.instituteTypeId);
		this.tenancyId = Number(data.tenancyId);
	}
}
