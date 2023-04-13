import { Routes, methodNotAllowed } from 'src/core/routes';
import { RouteOptions } from 'src/repositories/types';
import { PaymentFormController } from './payment-form.controller';

export class PaymentFormRoute extends Routes {
	constructor(options: RouteOptions, private paymentFormController: PaymentFormController) {
		super(options.app, options.auth);
	}

	exec() {
		this.app
			.route('/payment-forms')
			.all(this.auth?.exec().authenticate())
			.get(this.paymentFormController.list.bind(this.paymentFormController))
			.all(methodNotAllowed);

		this.app
			.route('/payment-forms/:id')
			.all(this.auth?.exec().authenticate())
			.get(this.paymentFormController.list.bind(this.paymentFormController))
			.all(methodNotAllowed);
	}
}
