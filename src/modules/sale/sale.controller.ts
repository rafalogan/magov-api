import { Request, Response } from 'express';
import { BAD_REQUEST } from 'http-status';

import { Controller } from 'src/core/controllers';
import { SalePaymentService, SaleService } from 'src/services';
import { IProduct, IUnitModel, IUserModel } from 'src/repositories/types';
import { isRequired, notExistisOrError, requiredFields, setAddress, setFileToSave } from 'src/utils';
import { ResponseHandle } from 'src/core/handlers';
import { ReadOptionsModel, SaleModel, SalePaymentModel } from 'src/repositories/models';

export class SaleController extends Controller {
	constructor(private saleService: SaleService, private salePaymentService: SalePaymentService) {
		super();
	}

	save(req: Request, res: Response) {
		const unit = this.setUnit(req);
		const user = this.setUser(req);
		const seller = this.setSeller(req);
		const products = this.setProducts(req);

		try {
			this.verifyRequest(req);
			this.verifyProducts(products);
			if (req.body.user) this.verifyUser(req.body.user);
		} catch (err) {
			return ResponseHandle.onError({ res, err });
		}

		const contract = setFileToSave(req);
		const sale = new SaleModel({ ...req.body, user, unit, contract, products, seller });

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
		const unit = this.setUnit(req);
		const user = this.setUser(req);
		const seller = this.setSeller(req);
		const products = this.setProducts(req);
		const contract = setFileToSave(req).url ? setFileToSave(req) : undefined;
		const sale = new SaleModel({ ...req.body, user, unit, contract, products, seller }, Number(id));

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

	private setSeller(req: Request) {
		if (req.body.seller) return req.body.seller;
		const { sellerName: seller, sellerCpf: cpf } = req.body;

		return { seller, cpf };
	}

	private verifyRequest(req: Request) {
		const { dueDate, value, commissionValue, installments, paymentForm } = req.body;
		const seller = this.setSeller(req);
		const { name, cnpj, plan, address } = this.setUnit(req);
		const { street, district, cep, city, uf } = address;

		const requireds = requiredFields([
			{ field: seller, message: isRequired('seller') },
			{ field: dueDate, message: isRequired('dueDate') },
			{ field: value, message: isRequired('value') },
			{ field: commissionValue, message: isRequired('commissionValue') },
			{ field: installments, message: isRequired('installments') },
			{ field: paymentForm, message: isRequired('paymentForm') },
			{ field: name, message: isRequired('name') },
			{ field: cnpj, message: isRequired('cnpj') },
			{ field: plan, message: isRequired('plan') },
			{ field: street, message: isRequired('street') },
			{ field: district, message: isRequired('district') },
			{ field: cep, message: isRequired('cep') },
			{ field: city, message: isRequired('city') },
			{ field: uf, message: isRequired('uf') },
		]);

		notExistisOrError(requireds, { message: requireds?.join('\n ') as string, status: BAD_REQUEST });
	}

	private verifyProducts(products: IProduct[]) {
		const requireds: any[] = [];

		products.forEach((item, ind) => {
			const { productId, amount, value } = item;
			const valid = requiredFields([
				{ field: productId, message: isRequired('productId') },
				{ field: amount, message: isRequired('amount') },
				{ field: value, message: isRequired('value') },
			]);

			if (valid?.length) requireds.push(`product - ${ind + 1}, ${valid?.join(',')};`);
		});

		notExistisOrError(requireds, { message: requireds?.join('\n '), status: BAD_REQUEST });
	}

	private setUnit(req: Request) {
		if (req.body.unit) return req.body.unit;
		const { unitId, unitName, description, cnpj, phone } = req.body;
		const { productId: id, amount } = this.setProducts(req)[0];

		const address = setAddress(req);
		const plan = { id, amount };

		return { id: unitId, name: unitName, description, cnpj, phone, address, plan } as IUnitModel;
	}

	private setUser(req: Request) {
		if (req.body.user) return req.body.user;
		const { userId: id, firstName, lastName, email, password, cpf, office, level, phone } = req.body;
		const plans = this.setProducts(req).map((i: IProduct) => {
			const { productId: id, amount, value } = i;
			return { id, value, amount };
		});
		const address = setAddress(req);

		return { id, firstName, lastName, password, confirmPassword: password, email, cpf, office, address, plans, level, phone } as IUserModel;
	}

	private verifyUser(user: IUserModel) {
		const { firstName, lastName, email, password, cpf, phone, office, level } = user;

		const requireds = requiredFields([
			{ field: firstName, message: isRequired('firstName') },
			{ field: lastName, message: isRequired('lastName') },
			{ field: email, message: isRequired('email') },
			{ field: password, message: isRequired('password') },
			{ field: cpf, message: isRequired('cpf') },
			{ field: phone, message: isRequired('phone') },
			{ field: level, message: isRequired('level') },
			{ field: office, message: isRequired('office') },
		]);

		notExistisOrError(requireds, { message: requireds?.join('\n '), status: BAD_REQUEST });
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
