import { IContactMessage, ISendMessage } from '../types';

export class SetMessageTrigger {
	contacts: IContactMessage[];
	tenancyId: number;
	message: string;

	constructor(data: ISendMessage) {
		this.contacts = data.contacts;
		this.tenancyId = Number(data.tenancyId);
		this.message = data.message.toString();
	}
}
