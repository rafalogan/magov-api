import { Request, Response } from 'express';
import { BAD_REQUEST } from 'http-status';

import { Controller } from 'src/core/controllers';
import { SalePaymentService, SaleService } from 'src/services';
import { isRequired, notExistisOrError, requiredFields, setFileToSave } from 'src/utils';
import { ResponseHandle } from 'src/core/handlers';
import { ReadOptionsModel, SaleModel, SalePaymentModel } from 'src/repositories/models';

export class SaleController extends Controller {
	constructor(private saleService: SaleService, private salePaymentService: SalePaymentService) {
		super();
	}

	save(req: Request, res: Response) {
		try {
			this.verifyRequest(req);
		} catch (err) {
			return ResponseHandle.onError({ res, err });
		}

		const contract = setFileToSave(req);
		const sale = new SaleModel({ ...req.body, contract });

		this.saleService
			.save(sale)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	savePayment(req: Request, res: Response) {
		try {
			this.verifyRequiredPayment(req);
		} catch (err) {
			return ResponseHandle.onError({ res, err });
		}

		const payment = new SalePaymentModel(req.body);

		this.salePaymentService
			.save(payment)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	edit(req: Request, res: Response) {
		const { id } = req.params;
		const contract = setFileToSave(req);
		const sale = new SaleModel({ ...req.body, contract }, Number(id));

		this.saleService
			.save(sale)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	editPayment(req: Request, res: Response) {
		const { id } = req.params;
		const payment = new SalePaymentModel(req.body, Number(id));

		this.salePaymentService
			.save(payment)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	list(req: Request, res: Response) {
		const { id } = req.params;
		const options = new ReadOptionsModel(req.query);

		this.saleService
			.read(options, Number(id))
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	listPayments(req: Request, res: Response) {
		const { id } = req.params;
		const { saleId } = req.query;

		this.salePaymentService
			.read(Number(saleId), Number(id))
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	remove(req: Request, res: Response) {
		const { id } = req.params;

		this.saleService
			.delete(Number(id))
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	removePayment(req: Request, res: Response) {
		const { id } = req.params;

		this.salePaymentService
			.delete(Number(id))
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	private setProducts(req: Request) {
		if (req.body.products) return req.body.products;
		const res: any[] = [];
		const { productId, amount, productValue: value } = req.body;
		res.push({ productId, amount, value });

		return res;
	}

	private verifyRequest(req: Request) {
		const {
			userId,
			unitId,
			tenancyId,
			products,
			seller,
			cpf,
			commission,
			commissionInstallments,
			dueDate,
			paymentForm,
			value,
			installments,
		} = req.body;

		const requireds = requiredFields([
			{ field: userId, message: isRequired('userId') },
			{ field: unitId, message: isRequired('unitId') },
			{ field: tenancyId, message: isRequired('tenancyId') },
			{ field: products, message: isRequired('products') },
			{ field: seller, message: isRequired('seller') },
			{ field: cpf, message: isRequired('cpf') },
			{ field: commission, message: isRequired('commission') },
			{ field: commissionInstallments, message: isRequired('commissionInstallments') },
			{ field: dueDate, message: isRequired('dueDate') },
			{ field: value, message: isRequired('value') },
			{ field: installments, message: isRequired('installments') },
			{ field: paymentForm, message: isRequired('paymentForm') },
		]);

		notExistisOrError(requireds, { message: requireds?.join('\n ') as string, status: BAD_REQUEST });
	}

	private verifyRequiredPayment(req: Request) {
		const { payDate, value, commission, saleId } = req.body;
		const requireds = requiredFields([
			{ field: payDate, message: isRequired('payDate') },
			{ field: value, message: isRequired('value') },
			{ field: commission !== undefined, message: isRequired('commission') },
			{ field: saleId, message: isRequired('saleId') },
		]);

		notExistisOrError(requireds, { message: requireds?.join('\n '), status: BAD_REQUEST });
	}
}
