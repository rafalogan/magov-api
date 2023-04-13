import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { ContactService } from 'src/services';
import { ContactController } from './contact.controller';
import { ContactRoute } from './contact.route';

export class ContactModule extends CommonModule {
	private readonly contactController: ContactController;
	private contactRoute: ContactRoute;

	constructor(options: ModuleOptions<ContactService>) {
		super();

		this.contactController = new ContactController(options.service);
		this.contactRoute = new ContactRoute(options, this.contactController);
	}

	exec = () => this.contactRoute.exec();
}
