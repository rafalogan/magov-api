import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { IUnitExpenseModel } from '../types';
import { UnitExpense } from './unit-expense.entity';

describe('#unit-expense Entity tests', () => {
	let unitExpense: UnitExpense;
	const mockUnitExpense: IUnitExpenseModel = {
		id: faker.number.int(10),
		expense: faker.lorem.words(3),
		description: undefined,
		dueDate: faker.date.future(),
		amount: faker.number.int(100),
		expenseTypeId: undefined,
		supplierId: undefined,
		active: faker.datatype.boolean(0.9),
		taskId: undefined,
		unitId: faker.number.int(10),
		tenancyId: faker.number.int(10),
		supplier: undefined,
		invoice: undefined,
		payments: [
			{
				paymentId: undefined,
				paymentForm: undefined,
				unitExpenseId: undefined,
				value: faker.number.float({ min: 10, max: 100, multipleOf: 0.02 }),
				installments: faker.number.int(1000),
			},
			{
				paymentId: undefined,
				paymentForm: undefined,
				unitExpenseId: undefined,
				value: faker.number.float({ min: 10, max: 100, multipleOf: 0.02 }),
				installments: faker.number.int(1000),
			},
		],
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		unitExpense = new UnitExpense(mockUnitExpense);
	});

	it('should create a new unitExpense instance', () => {
		expect(unitExpense).toBeInstanceOf(UnitExpense);
	});
});
