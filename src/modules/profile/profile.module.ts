import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { ProfileService } from 'src/services';
import { ProfileController } from './profile.controller';
import { ProfileRoute } from './profile.route';

export class ProfileModule extends CommonModule {
	private readonly profileController: ProfileController;
	private profileRoute: ProfileRoute;

	constructor(options: ModuleOptions<ProfileService>) {
		super();

		this.profileController = new ProfileController(options.service);
		this.profileRoute = new ProfileRoute(options, this.profileController);
	}

	exec = () => this.profileRoute.exec();
}
