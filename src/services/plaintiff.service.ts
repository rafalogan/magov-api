import { PlaintiffModel } from 'src/repositories/models';
import { IServiceOptions } from 'src/repositories/types';
import { DatabaseService } from './abistract-database.service';

export class PlaintiffService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	create(data: PlaintiffModel) {}

	update(data: PlaintiffModel, id: number) {}
}
