import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { IRule } from '../types';
import { Rule } from './rule.entity';

describe('#rule Entity tests', () => {
	let rule: Rule;
	const mockRule: IRule = { name: faker.string.sample(20), code: faker.string.sample(20).toUpperCase(), description: undefined };

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		rule = new Rule(mockRule);
	});

	it('should create an instance', () => {
		expect(rule).toBeInstanceOf(Rule);
	});
});
