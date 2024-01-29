import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { IUnitExpensePayment } from '../types';
import { UnitExpensePayment } from './unit-expense-payment.entity';

describe('#unit-expense-payment Entity tests', () => {
	let unitExpensePayment: UnitExpensePayment;
	const mockUnitExpensePayment: IUnitExpensePayment = {
		paymentId: undefined,
		paymentForm: undefined,
		unitExpenseId: undefined,
		value: faker.number.float({ min: 10, max: 100, multipleOf: 0.02 }),
		installments: faker.number.int(10),
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		unitExpensePayment = new UnitExpensePayment(mockUnitExpensePayment);
	});

	it('should create a new unitExpensePayment instance', () => {
		expect(unitExpensePayment).toBeInstanceOf(UnitExpensePayment);
	});
});
