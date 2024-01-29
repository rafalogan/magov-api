import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { ITask } from '../types';
import { Task } from './task.entity';

describe('#task Entity tests', () => {
	let task: Task;
	const mockTask: ITask = {
		id: faker.number.int(10),
		title: faker.lorem.words(3),
		description: undefined,
		cost: undefined,
		start: faker.date.past(),
		end: faker.date.future(),
		level: faker.number.int(10),
		status: faker.number.int(10),
		userId: faker.number.int(10),
		unitId: faker.number.int(10),
		tenancyId: faker.number.int(10),
		demandId: undefined,
		propositionId: undefined,
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		task = new Task(mockTask);
	});

	it('should create a new task instance', () => {
		expect(task).toBeInstanceOf(Task);
	});
});
