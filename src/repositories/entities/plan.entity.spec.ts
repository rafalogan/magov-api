import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { IPlan } from '../types';
import { Plan } from './plan.entity';

describe('#Plan Entity tests', () => {
	const mockPlan: IPlan = {
		id: 10,
		name: faker.name.fullName(),
		description: new Blob([faker.lorem.paragraphs(5)]),
		userLimit: 100,
		unitaryValue: 250,
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
		expect(result.decription).toBeDefined();
	});
});
