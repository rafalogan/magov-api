import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { KeywordService } from 'src/services';
import { KeywordController } from './keyword.controller';
import { KeywordRoute } from './keyword.route';

export class KeywordModule extends CommonModule {
	private readonly keywordController: KeywordController;
	private keywordRoute: KeywordRoute;

	constructor(options: ModuleOptions<KeywordService>) {
		super();

		this.keywordController = new KeywordController(options.service);
		this.keywordRoute = new KeywordRoute(options, this.keywordController);
	}

	exec = () => this.keywordRoute.exec();
}
