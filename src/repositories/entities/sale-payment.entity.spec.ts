import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { ISalePayment } from '../types';
import { SalePayment } from './sale-payment.entity';

describe('#sale-payment Entity tests', () => {
	let salePayment: SalePayment;
	const mockSalePayment: ISalePayment = {
		id: faker.number.int(10),
		payDate: faker.date.past(),
		value: number;
		installment: number;
		type: string;
		commission: boolean;
		saleId: number;
	};
	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();
	});
});
