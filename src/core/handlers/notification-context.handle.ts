export class NotificationContext {
	notifications: string[];

	constructor() {
		this.notifications = [];
	}

	hasNotifications() {
		return this.notifications.length > 0;
	}

	addNotification(notification: string) {
		this.notifications.push(notification);
	}
}
