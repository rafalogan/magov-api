import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { IOrigin } from '../types';
import { Origin } from './origin.entity';

describe('#origin Entity tests', () => {
	let origin: Origin;
	const mockOrigin: IOrigin = {
		id: faker.number.int(10),
		origin: faker.string.sample(20),
		description: undefined,
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		origin = new Origin(mockOrigin);
	});

	it('should create an instance', () => {
		expect(origin).toBeInstanceOf(Origin);
	});
});
