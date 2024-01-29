import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { ITypesRecipes } from '../types';
import { TypesRecipes } from './types-recipes.entity';

describe('#types-recipes Entity tests', () => {
	let typesRecipes: TypesRecipes;
	const mockTypesRecipes: ITypesRecipes = {
		id: faker.number.int(10),
		origin: faker.lorem.words(3),
		description: undefined,
		government: faker.datatype.boolean(0.9),
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		typesRecipes = new TypesRecipes(mockTypesRecipes);
	});

	it('should create a new typesRecipes instance', () => {
		expect(typesRecipes).toBeInstanceOf(TypesRecipes);
	});
});
