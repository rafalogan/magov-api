import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { IRevenue } from '../types';
import { Revenue } from './revenue.entity';

describe('#revenue Entity tests', () => {
	let revenue: Revenue;
	const mockRevenue: IRevenue = {
		id: faker.number.int(10),
		revenue: faker.string.sample(20),
		receive: faker.date.future(),
		description: undefined,
		status: faker.number.int(5),
		active: faker.datatype.boolean(0.9),
		recurrent: faker.datatype.boolean(),
		documentUrl: undefined,
		documentNumber: undefined,
		value: faker.number.float({ min: 10, max: 100, multipleOf: 0.02 }),
		unitId: faker.number.int(10),
		originId: faker.number.int(10),
		tenancyId: faker.number.int(10),
		government: faker.datatype.boolean(),
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		revenue = new Revenue(mockRevenue);
	});

	it('should create an instance', () => {
		expect(revenue).toBeInstanceOf(Revenue);
	});
});
