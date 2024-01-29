import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { ISeller } from '../types';
import { Seller } from './seller.entity';

describe('#seller Entity tests', () => {
	let seller: Seller;
	const mockSeller: ISeller = {
		seller: faker.person.fullName(),
		cpf: '12345678901',
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		seller = new Seller(mockSeller);
	});

	it('should create a new Seller instance', () => {
		expect(seller).toBeInstanceOf(Seller);
	});
});
