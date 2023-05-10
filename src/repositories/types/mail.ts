export interface SendEmailOptions {
	to?: string;
	from?: string;
	subject?: string;
	message?: string;
}

export interface INotification {
	to: string;
	subject: string;
	message: Blob | string;
	from: string | string[];
}
