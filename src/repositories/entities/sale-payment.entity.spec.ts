import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { ISalePayment } from '../types';
import { SalePayment } from './sale-payment.entity';

describe('#sale-payment Entity tests', () => {
	let salePayment: SalePayment;
	const mockSalePayment: ISalePayment = {
		id: faker.number.int(10),
		payDate: faker.date.past(),
		value: faker.number.float({ min: 10, max: 100, multipleOf: 0.02 }),
		installment: faker.number.int(10),
		type: 'CREDIT',
		commission: faker.datatype.boolean(),
		saleId: faker.number.int(10),
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		salePayment = new SalePayment(mockSalePayment);
	});

	it('should create a new SalePayment instance', () => {
		expect(salePayment).toBeInstanceOf(SalePayment);
	});
});
