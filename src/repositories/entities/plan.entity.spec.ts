import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { faker } from '@faker-js/faker';

import { IPlan } from '../types';
import { Plan } from './plan.entity';

describe('#Plan Entity tests', () => {
	const mockPlan: IPlan = {
		id: faker.number.int(10),
		name: faker.string.sample(20),
		description: undefined,
		limit: faker.number.int(1000),
		value: faker.number.float({ min: 10, max: 100, multipleOf: 0.02 }),
		active: faker.datatype.boolean(0.9),
		typeId: faker.number.int(10),
		type: faker.string.sample(20),
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();
	});

	it('Should be able to crate new istance of Plan', () => {
		const expected = { ...mockPlan, description: mockPlan.description?.toString() };
		const result = new Plan(mockPlan);

		expect(result).instanceof(Plan);
		expect(result).toStrictEqual(expected);
		expect(result.description).toBeDefined();
	});
});
