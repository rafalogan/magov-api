import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { IUserLog } from '../types';
import { UserLog } from './user-log.entity';

describe('#user_log Entity tests', () => {
	let userLog: UserLog;
	const mockUserLog: IUserLog = {
		action: faker.lorem.word(),
		inTable: faker.lorem.word(),
		inTableId: faker.number.int(10),
		logDate: faker.date.past(),
		userId: faker.number.int(10),
		tenancyId: faker.number.int(10),
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		userLog = new UserLog(mockUserLog);
	});

	it('should create a new userLog instance', () => {
		expect(userLog).toBeInstanceOf(UserLog);
	});
});
