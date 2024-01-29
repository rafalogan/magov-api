import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { ITenancy } from '../types';
import { Tenancy } from './tenancy.entity';

describe('#tenancy Entity tests', () => {
	let tenancy: Tenancy;
	const mockTenancy: ITenancy = {
		id: faker.number.int(10),
		tenancyKey: undefined,
		totalUsers: undefined,
		dueDate: faker.date.future(),
		active: faker.datatype.boolean(0.9),
		plans: [
			{
				id: faker.number.int(10),
				name: faker.lorem.words(3),
				usersLimit: undefined,
			},
			{
				id: faker.number.int(10),
				name: faker.lorem.words(3),
				usersLimit: undefined,
			},
		],
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		tenancy = new Tenancy(mockTenancy);
	});

	it('should create a new tenancy instance', () => {
		expect(tenancy).toBeInstanceOf(Tenancy);
	});
});
