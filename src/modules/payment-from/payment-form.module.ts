import { CommonModule } from 'src/core/modules';
import { ModuleOptions } from 'src/repositories/types';
import { PaymentFormController } from './payment-form.controller';
import { PaymentFormRoute } from './payment-form.route';
import { PaymentFormService } from 'src/services';

export class PaymentFormModule extends CommonModule {
	private readonly paymentFormController: PaymentFormController;
	private paymentFormRoute: PaymentFormRoute;

	constructor(options: ModuleOptions<PaymentFormService>) {
		super();

		this.paymentFormController = new PaymentFormController(options.service);
		this.paymentFormRoute = new PaymentFormRoute(options, this.paymentFormController);
	}

	exec = () => this.paymentFormRoute.exec();
}
