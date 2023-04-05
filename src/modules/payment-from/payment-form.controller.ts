import { Request, Response } from 'express';

import { PaymentFormService } from 'src/services';
import { ResponseHandle } from 'src/core/handlers';

export class PaymentFormController {
	constructor(private paymentFormService: PaymentFormService) {}

	list(req: Request, res: Response) {
		const { id } = req.params;

		this.paymentFormService
			.read(Number(id))
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}
}
