import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { IInstituteType } from '../types';
import { InstituteType } from './institute-type.entity';

describe('#institute-type Entity tests', () => {
	let instituteType: InstituteType;
	const mockInstituteType: IInstituteType = {
		id: faker.number.int(),
		name: faker.string.sample(20),
		active: faker.datatype.boolean(0.9),
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		instituteType = new InstituteType(mockInstituteType);
	});

	it('should create an instance', () => {
		expect(instituteType).toBeInstanceOf(InstituteType);
	});
});
