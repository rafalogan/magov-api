export interface IMessageTrigger {
	id?: number;
	tenancyId: number;
	triggers: number;
	dueDate: string | Date;
}

export interface IMessageHistory {
	id?: number;
	tenancyId: number;
	message: string | Blob;
	sendDate: Date | string;
	expiresAt?: Date | string;
}

export interface ISendMessage {
	contacts: IContactMessage[];
	tenancyId: number;
	message: string | Blob;
}

export interface IContactMessage {
	id?: number;
	name: string;
	phone: string;
	email: string;
}
