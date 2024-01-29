import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { IProfileView } from '../types';
import { ProfileView } from './profile-view.entity';

describe('#profile-view Entity tests', () => {
	let profileView: ProfileView;
	const mockProfileView: IProfileView = {
		id: undefined,
		name: faker.string.sample(20),
		code: faker.string.sample(20).toUpperCase(),
		description: undefined,
		active: faker.datatype.boolean(0.9),
		rules: [
			{
				id: faker.number.int(10),
				name: faker.string.sample(20),
				code: faker.string.sample(20).toUpperCase(),
				description: undefined,
			},
			{
				id: faker.number.int(10),
				name: faker.string.sample(20),
				code: faker.string.sample(20).toUpperCase(),
				description: undefined,
			},
		],
	};
	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		profileView = new ProfileView(mockProfileView);
	});

	it('should create an instance', () => {
		expect(profileView).toBeInstanceOf(ProfileView);
	});
});
