import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker, fakerPT_BR } from '@faker-js/faker';

import { IAddress } from '../types';
import { Address } from './address.entity';

describe('#address Entity tests', () => {
	const addressMock: IAddress = {
		id: faker.number.int(10),
		cep: fakerPT_BR.location.zipCode(),
		street: faker.location.street(),
		number: undefined,
		complement: undefined,
		district: faker.location.county(),
		city: faker.location.city(),
		uf: fakerPT_BR.location.countryCode(),
	};

	let adress: Address;

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		adress = new Address(addressMock);
	});

	it('should be defined', () => {
		expect(addressMock).toBeDefined();
		expect(adress).toBeDefined();
	});
});
