import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { ISendMessage } from '../types';
import { SetMessageTrigger } from './set-message-trigger.entity';

describe('#set-message-trigger Entity tests', () => {
	let setMessageTrigger: SetMessageTrigger;
	const mockSetMessageTrigger: ISendMessage = {
		contacts: [
			{
				id: faker.number.int(10),
				name: faker.person.fullName(),
				phone: faker.phone.number(),
				email: faker.internet.email(),
			},
			{
				id: faker.number.int(10),
				name: faker.person.fullName(),
				phone: faker.phone.number(),
				email: faker.internet.email(),
			},
		],
		tenancyId: faker.number.int(10),
		message: faker.lorem.paragraph(5),
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		setMessageTrigger = new SetMessageTrigger(mockSetMessageTrigger);
	});

	it('should create a new SetMessageTrigger instance', () => {
		expect(setMessageTrigger).toBeInstanceOf(SetMessageTrigger);
	});
});
