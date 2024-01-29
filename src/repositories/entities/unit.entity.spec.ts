import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { IUnit } from '../types';
import { Unit } from './unit.entity';

describe('#unit Entity tests', () => {
	let unit: Unit;
	const mockUnit: IUnit = {
		id: faker.number.int(10),
		name: faker.lorem.words(3),
		description: undefined,
		cnpj: '12345678901234',
		phone: faker.phone.number(),
		tenancyId: faker.number.int(10),
		active: faker.datatype.boolean(0.9),
		address: {
			cep: faker.location.zipCode(),
			street: faker.location.street(),
			number: undefined,
			complement: undefined,
			district: faker.location.secondaryAddress(),
			city: faker.location.city(),
			uf: faker.location.state(),
		},
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		unit = new Unit(mockUnit);
	});

	it('should create a new unit instance', () => {
		expect(unit).toBeInstanceOf(Unit);
	});
});
