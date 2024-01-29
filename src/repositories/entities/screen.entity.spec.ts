import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { IScreen } from '../types';
import { AppScreen } from './screen.entity';

describe('#screen Entity tests', () => {
	let screen: AppScreen;
	const mockScreen: IScreen = {
		id: faker.number.int(10),
		code: faker.string.sample(10),
		name: faker.lorem.word(3),
		description: undefined,
		active: faker.datatype.boolean(0.9),
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		screen = new AppScreen(mockScreen);
	});

	it('should create a new Screen instance', () => {
		expect(screen).toBeInstanceOf(Screen);
	});
});
