import { NotificationEntry } from 'src/repositories/entities';
import { MailService } from './mail.service';
import { SendEmailOptions } from 'src/repositories/types';

export class NotificationService {
	constructor(private mailService: MailService) {}

	async emailNotificate(data: NotificationEntry) {
		return this.mailService
			.send(data as SendEmailOptions)
			.then(() => ({ message: 'Mail Notification successfully sent', data }))
			.catch(err => err);
	}
}
