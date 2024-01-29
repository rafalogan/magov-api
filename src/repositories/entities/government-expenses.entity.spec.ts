import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { IGovernmentExpensesModel } from '../types';
import { GovernmentExpenses } from './government-expenses.entity';

describe('#government-expenses Entity tests', () => {
	let governmentExpenses: GovernmentExpenses;
	const mockGovernmentExpenses: IGovernmentExpensesModel = {
		id: faker.number.int(10),
		expense: faker.string.sample(10),
		description: undefined,
		dueDate: faker.date.future(),
		value: faker.number.float({ min: 1000, max: 100000, multipleOf: 0.02 }),
		observations: undefined,
		active: faker.datatype.boolean(0.9),
		propositionId: faker.number.int(10),
		taskId: undefined,
		tenancyId: faker.number.int(10),
		budgets: undefined,
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		governmentExpenses = new GovernmentExpenses(mockGovernmentExpenses);
	});

	it('should create a new instance of government-expenses', () => {
		expect(governmentExpenses).toBeInstanceOf(GovernmentExpenses);
	});
});
