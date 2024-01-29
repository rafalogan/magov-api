import { beforeEach, describe, vitest, it, expect } from 'vitest';
import { faker } from '@faker-js/faker';

import { IPropositionsType } from '../types';
import { PropositionsType } from './propositions-type.entity';

describe('#Propositions-type Entity tests', () => {
	let propositionsType: PropositionsType;
	const mockPropositionsType: IPropositionsType = {
		name: faker.string.sample(20),
		fileId: undefined,
		description: undefined,
		document: undefined,
		active: faker.datatype.boolean(0.9),
		parentId: undefined,
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		propositionsType = new PropositionsType(mockPropositionsType);
	});

	it('should create an instance', () => {
		expect(propositionsType).toBeInstanceOf(PropositionsType);
	});
});
