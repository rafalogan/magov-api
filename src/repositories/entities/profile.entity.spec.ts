import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { IProfile } from '../types';
import { Profile } from './profile.entity';

describe('#profile Entity tests', () => {
	let profile: Profile;
	const mockProfile: IProfile = {
		id: undefined,
		name: faker.string.sample(20),
		code: faker.string.sample(20).toUpperCase(),
		description: undefined,
		active: faker.datatype.boolean(0.9),
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		profile = new Profile(mockProfile);
	});

	it('should create an instance', () => {
		expect(profile).toBeInstanceOf(Profile);
	});
});
