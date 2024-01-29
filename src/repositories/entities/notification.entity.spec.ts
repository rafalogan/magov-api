import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { INotification } from '../types';
import { NotificationEntry } from './notification.entity';

describe('#notification Entity tests', () => {
	let notification: NotificationEntry;
	const mockNotification: INotification = {
		to: faker.internet.email(),
		subject: faker.string.sample(50),
		message: faker.lorem.paragraph(5),
		from: faker.internet.email(),
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		notification = new NotificationEntry(mockNotification);
	});

	it('should create an instance', () => {
		expect(notification).toBeInstanceOf(NotificationEntry);
	});
});
