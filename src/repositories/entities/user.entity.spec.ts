import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { IUser } from '../types';
import { User } from './user.entity';

describe('#user Entity tests', () => {
	let user: User;
	const mockUser: IUser = {
		firstName: faker.person.firstName(),
		lastName: faker.person.lastName(),
		email: faker.internet.email(),
		password: faker.internet.password(),
		confirmPassword: undefined,
		cpf: '12345678901',
		phone: faker.phone.number(),
		office: faker.lorem.words(3),
		active: faker.datatype.boolean(0.9),
		level: faker.number.int(47),
		unitId: undefined,
		tenancyId: undefined,
	};
	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		user = new User(mockUser);
	});

	it('should create a new user instance', () => {
		expect(user).toBeInstanceOf(User);
	});
});
