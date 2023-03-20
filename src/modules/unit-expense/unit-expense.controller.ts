import { BAD_REQUEST } from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { UnitExpenseService } from 'src/services';
import { IUnitExpensePayment } from 'src/repositories/types';
import { existsOrError, isRequired, notExistisOrError, requiredFields, setFileToSave } from 'src/utils';
import { ResponseHandle, getTenancyByToken } from 'src/core/handlers';
import { ReadOptionsModel, UnitExpenseModel } from 'src/repositories/models';

export class UnitExpenseController extends Controller {
	constructor(private unitExpenseService: UnitExpenseService) {
		super();
	}

	save(req: Request, res: Response) {
		try {
			this.validateRequest(req);
		} catch (err) {
			return ResponseHandle.onError({ res, err });
		}

		const invoice = setFileToSave(req);
		const tenancyId = getTenancyByToken(req) || Number(req.body.tenancyId);
		const unitExpense = new UnitExpenseModel({ ...req.body, invoice, tenancyId });

		this.unitExpenseService
			.save(unitExpense)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	edit(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = getTenancyByToken(req) || Number(req.body.tenancyId);

		try {
			existsOrError(tenancyId, { message: isRequired('tenancyId'), status: BAD_REQUEST });
		} catch (err) {
			return ResponseHandle.onError({ res, err });
		}

		const unitExpense = new UnitExpenseModel({ ...req.body, tenancyId }, Number(id));

		this.unitExpenseService
			.save(unitExpense)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	list(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = getTenancyByToken(req) || Number(req.query.tenancyId);
		const options = new ReadOptionsModel({ ...req.query, tenancyId });

		this.unitExpenseService
			.read(options, Number(id))
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	remove(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = getTenancyByToken(req) || Number(req.query.tenancyId);

		this.unitExpenseService
			.disable(Number(id), tenancyId)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	private validateRequest(req: Request) {
		const { expense, dueDate, amount, payments } = req.body;
		const tenancyId = getTenancyByToken(req) || Number(req.body.tenancyId);
		const requireds = requiredFields([
			{ field: expense, message: isRequired('expense') },
			{ field: dueDate, message: isRequired('dueDate') },
			{ field: amount, message: isRequired('amount') },
			{ field: payments.length !== 0, message: isRequired('At last one payments') },
			{ field: tenancyId, message: isRequired('tenancyId') },
		]);

		const paymnentValidate = payments.length ? this.requiredPayment(payments) : undefined;

		if (paymnentValidate?.length) paymnentValidate?.forEach(i => (typeof i === 'string' ? requireds?.push(i) : undefined));

		notExistisOrError(requireds, { message: requireds?.join('\n '), status: BAD_REQUEST });
	}

	private requiredPayment(payments: IUnitExpensePayment[]) {
		return payments.map((item, index) => {
			const { paymentId, value } = item;
			const requireds = requiredFields([
				{ field: paymentId, message: isRequired('paymentId') },
				{ field: value, message: isRequired('value') },
			]);
			if (requireds?.length) return `payment: ${index + 1}, ${requireds.join('\n ')}`;
			return;
		});
	}
}
