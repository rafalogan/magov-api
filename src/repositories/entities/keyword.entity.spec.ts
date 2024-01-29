import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { IKeyword } from '../types';
import { Keyword } from './keyword.entity';

describe('#keyeword Entity tests', () => {
	let keyword: Keyword;
	const mockKeyword: IKeyword = {
		id: faker.number.int(),
		keyword: faker.string.sample(20),
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		keyword = new Keyword(mockKeyword);
	});

	it('should create an instance', () => {
		expect(keyword).toBeInstanceOf(Keyword);
	});
});
