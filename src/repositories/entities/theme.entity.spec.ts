import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { ITheme } from '../types';
import { Theme } from './theme.entity';

describe('#theme Entity tests', () => {
	let theme: Theme;
	const mockTheme: ITheme = {
		name: faker.string.sample(10),
		description: undefined,
		active: faker.datatype.boolean(0.9),
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		theme = new Theme(mockTheme);
	});

	it('should create a new theme instance', () => {
		expect(theme).toBeInstanceOf(Theme);
	});
});
