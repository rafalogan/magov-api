import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { IComment } from '../types';
import { Comment } from './comment.entity';

describe('#comment Entity tests', () => {
	let comment: Comment;
	const commentMock: IComment = {
		id: faker.number.int(10),
		comment: faker.lorem.sentence(),
		active: true,
		taskId: undefined,
		userId: faker.number.int(10),
		parentId: undefined,
		tenancyId: faker.number.int(10),
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		comment = new Comment(commentMock);
	});

	it('should be defined', () => {
		expect(commentMock).toBeDefined();
		expect(comment).toBeDefined();
	});
});
