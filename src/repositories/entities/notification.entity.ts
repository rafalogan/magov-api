import { convertBlobToString } from 'src/utils';
import { INotification } from '../types';

export class NotificationEntry implements INotification {
	to: string | string[];
	subject: string;
	message: Blob | string;
	from: string;

	constructor(data: INotification) {
		this.to = this.setTo(data.to);
		this.subject = data.subject.trim() || 'Contato';
		this.message = convertBlobToString(data.message) as string;
		this.from = data.from.trim() || 'contato@magov.com';
	}

	private setTo(item: string | string[]) {
		if (typeof item === 'string') return item;

		return item.join(', ');
	}
}
