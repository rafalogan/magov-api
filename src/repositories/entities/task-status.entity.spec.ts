import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { ITaskStatus } from '../types';
import { TaskStatus } from './task-status.entity';

describe('#task-status Entity tests', () => {
	let taskStatus: TaskStatus;
	const mockStatus: ITaskStatus = {
		status: faker.string.sample(7),
		description: faker.lorem.paragraph(1),
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		taskStatus = new TaskStatus(mockStatus);
	});

	it('Intances', async () => {
		expect(taskStatus).toBeDefined();
	});
});
