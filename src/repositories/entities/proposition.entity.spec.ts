import { beforeEach, describe, vitest, it, expect } from 'vitest';
import { faker } from '@faker-js/faker';

import { IProposition } from '../types';
import { Proposition } from './proposition.entity';

describe('#Proposition Entity tests', () => {
	let proposition: Proposition;
	const mockProposition: IProposition = {
		title: faker.string.sample(20),
		menu: faker.lorem.paragraph(5),
		deadline: faker.date.future(),
		active: faker.datatype.boolean(0.9),
		favorite: undefined,
		expense: undefined,
		parentId: undefined,
		unitId: faker.number.int(10),
		typeId: faker.number.int(10),
		tenancyId: faker.number.int(10),
		propositionUrl: undefined,
		textEditor: undefined,
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		proposition = new Proposition(mockProposition);
	});

	it('should create an instance', () => {
		expect(proposition).toBeInstanceOf(Proposition);
	});
});
