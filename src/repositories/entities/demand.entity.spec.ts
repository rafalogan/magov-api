import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { IDemand } from '../types';
import { Demand } from './demand.entity';

describe('#demand Entity tests', () => {
	let demand: Demand;
	const demandMock: IDemand = {
		id: faker.number.int(10),
		name: faker.string.sample(),
		description: faker.lorem.paragraph(),
		favorite: faker.datatype.boolean(),
		level: faker.number.int(10),
		active: faker.datatype.boolean(0.9),
		deadLine: faker.date.future(),
		approximateIncome: faker.number.float({ min: 10, max: 100, multipleOf: 0.02 }),
		status: undefined,
		createdAt: faker.date.recent(),
		unitId: faker.number.int(10),
		userId: faker.number.int(10),
		plaintiffId: faker.number.int(10),
		tenancyId: faker.number.int(10),
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		demand = new Demand(demandMock);
	});

	it('should be defined', () => {
		expect(demandMock).toBeDefined();
		expect(demand).toBeDefined();
	});
});
