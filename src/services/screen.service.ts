import { Request } from 'express';
import { } from 'http-status';

import { IServiceOptions } from 'src/repositories/types';
import { DatabaseService } from './abistract-database.service';
import { AppScreen } from 'src/repositories/entities';

export class ScreenService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	create(data: AppScreen,) { }

	update(data: AppScreen, id: number | string, req: Request) { }
}
