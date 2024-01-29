import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { IPlantiff } from '../types';
import { Plaintiff } from './plaintiff.entity';

describe('#plaintiff Entity tests', () => {
	let plaintiff: Plaintiff;
	const mockPlaintiff: IPlantiff = {
		id: faker.number.int(10),
		name: faker.person.fullName(),
		birthday: faker.date.past(),
		institute: faker.string.sample(20),
		cpfCnpj: '00000000000',
		relationshipType: undefined,
		observation: undefined,
		relatives: undefined,
		voterRegistration: undefined,
		active: faker.datatype.boolean(0.9),
		parentId: undefined,
		instituteTypeId: faker.number.int(10),
		tenancyId: faker.number.int(10),
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		plaintiff = new Plaintiff(mockPlaintiff);
	});

	it('should create an instance', () => {
		expect(plaintiff).toBeInstanceOf(Plaintiff);
	});
});
