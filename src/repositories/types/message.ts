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
}
