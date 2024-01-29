import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { ISale } from '../types';
import { Sale } from './sale.entity';

describe('#sale Entity tests', () => {
	let sale: Sale;
	const mockSale: ISale = {
		id: faker.number.int(10),
		dueDate: faker.date.future(),
		value: faker.number.float({ min: 10, max: 100, multipleOf: 0.02 }),
		commissionValue: faker.number.float({ min: 10, max: 100, multipleOf: 0.02 }),
		commissionInstallments: faker.number.int(10),
		installments: faker.number.int(10),
		description: faker.lorem.paragraph(5),
		paymentId: faker.number.int(10),
		unitId: faker.number.int(10),
		tenancyId: faker.number.int(10),
		userId: faker.number.int(10),
		sellerId: faker.number.int(10),
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		sale = new Sale(mockSale);
	});

	it('should create a new Sale instance', () => {
		expect(sale).toBeInstanceOf(Sale);
	});
});
