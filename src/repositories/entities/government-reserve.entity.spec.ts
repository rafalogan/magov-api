import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { IGovernmentReserve } from '../types';
import { GovernmentReserve } from './government-reserve.entity';

describe('#government-reserve Entity tests', () => {
	let governmentReserve: GovernmentReserve;
	const mockGovernmentReserve: IGovernmentReserve = {
		id: faker.number.int(10),
		reserves: [
			{
				id: faker.number.int(10),
				date: faker.date.future(),
				value: faker.number.float({ min: 1000, max: 100000, multipleOf: 0.02 }),
				revenue: faker.string.sample(10),
				revenueValue: faker.number.float({ min: 1000, max: 100000, multipleOf: 0.02 }),
			},
			{
				id: faker.number.int(10),
				date: faker.date.future(),
				value: faker.number.float({ min: 1000, max: 100000, multipleOf: 0.02 }),
				revenue: faker.string.sample(10),
				revenueValue: faker.number.float({ min: 1000, max: 100000, multipleOf: 0.02 }),
			},
			{
				id: faker.number.int(10),
				date: faker.date.future(),
				value: faker.number.float({ min: 1000, max: 100000, multipleOf: 0.02 }),
				revenue: faker.string.sample(10),
				revenueValue: faker.number.float({ min: 1000, max: 100000, multipleOf: 0.02 }),
			},
		],
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		governmentReserve = new GovernmentReserve(mockGovernmentReserve);
	});

	it('should create a new instance of government-reserve', () => {
		expect(governmentReserve).toBeInstanceOf(GovernmentReserve);
	});
});
