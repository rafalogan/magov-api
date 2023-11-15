import { convertToDate, setInstanceId } from 'src/utils';
import { IMessageTrigger } from '../types';

export class MessageTrigger {
	id?: number;
	tenancyId: number;
	triggers: number;
	dueDate: Date;

	constructor(data: IMessageTrigger, id?: number) {
		this.id = setInstanceId(id || data?.id);
		this.tenancyId = Number(data.tenancyId);
		this.triggers = Number(data.triggers);
		this.dueDate = convertToDate(data.dueDate);
	}
}
