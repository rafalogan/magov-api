import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { ISupplier } from '../types';
import { Supplier } from './supplier.entity';

describe('#supplier Entity tests', () => {
	let supplier: Supplier;
	const mockSupplier: ISupplier = {
		id: faker.number.int(10),
		name: faker.person.fullName(),
		description: undefined,
		tenancyId: faker.number.int(10),
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		supplier = new Supplier(mockSupplier);
	});

	it('should create a new supplier instance', () => {
		expect(supplier).toBeInstanceOf(Supplier);
	});
});
