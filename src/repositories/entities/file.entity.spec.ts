import { describe, expect, it, vitest, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { IFile } from '../types';
import { FileEntity } from './file.entity';

describe('#file Entity tests', () => {
	let file: FileEntity;
	const flieMock: IFile = {
		id: faker.number.int(10),
		title: undefined,
		alt: undefined,
		name: faker.string.sample(),
		filename: faker.system.fileName(),
		type: faker.system.mimeType(),
		url: faker.internet.url(),
		location: undefined,
		userId: undefined,
		demandId: undefined,
		expanseId: undefined,
		propositionId: undefined,
		revenueId: undefined,
		plaintiffId: undefined,
		documentId: undefined,
	};

	beforeEach(() => {
		vitest.resetAllMocks();
		vitest.clearAllMocks();

		file = new FileEntity(flieMock);
	});

	it('should be defined', () => {
		expect(file).toBeDefined();
	});
});
