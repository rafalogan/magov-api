import { IServiceOptions } from 'src/repositories/types';
import { DatabaseService } from './abistract-database.service';
import { CommentModel, ReadOptionsModel } from 'src/repositories/models';

export class CommentService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}
	async create(data: CommentModel) {}

	async update(data: CommentModel, id: number) {}

	async read(options: ReadOptionsModel, id?: number) {}

	async getComment(value: number, tenancyId: number) {}

	async disabled(id: number, tenancyId: number) {}
}
