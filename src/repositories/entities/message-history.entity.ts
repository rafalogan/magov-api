import { convertToDate, setInstanceId } from 'src/utils';
import { IMessageHistory } from '../types';

export class MessageHistory {
	id?: number;
	tenancyId: number;
	message: string;
	sendDate: Date;

	constructor(data: IMessageHistory, id?: number) {
		this.id = setInstanceId(id || data?.id);
		this.tenancyId = Number(data.tenancyId);
		this.message = data.message.toString();
		this.sendDate = convertToDate(data.sendDate);
	}
}
