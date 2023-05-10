import { convertBlobToString } from 'src/utils';
import { INotification } from '../types';

export class NotificationEntry implements INotification {
	to: string;
	subject: string;
	message: Blob | string;
	from: string | string[];

	constructor(data: INotification) {
		this.to = data.to.trim() || 'contato@magov.com';
		this.subject = data.subject.trim() || 'Contato';
		this.message = convertBlobToString(data.message) as string;
		this.from = this.setFrom(data.from);
	}

	private setFrom(item: string | string[]) {
		if (typeof item === 'string') return item;

		return item.join(', ');
	}
}
