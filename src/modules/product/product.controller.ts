import { BAD_REQUEST, UNAUTHORIZED } from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { ProductService } from 'src/services';
import { Plan } from 'src/repositories/entities';
import { ResponseHandle, getTenancyByToken } from 'src/core/handlers';
import { ReadOptionsModel } from 'src/repositories/models';
import { isRequired, notExistisOrError, requiredFields } from 'src/utils';

export class ProductController extends Controller {
	constructor(private productService: ProductService) {
		super();
	}

	save(req: Request, res: Response) {
		if (getTenancyByToken(req)) return ResponseHandle.onError({ message: 'User Unauthorized', status: UNAUTHORIZED, res });
		try {
			this.validRequest(req);
		} catch (message: any) {
			return ResponseHandle.onError({ res, message, status: BAD_REQUEST });
		}

		const product = new Plan(req.body);

		this.productService
			.save(product, req)
			.then(data => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	edit(req: Request, res: Response) {
		if (getTenancyByToken(req)) return ResponseHandle.onError({ message: 'User Unauthorized', status: UNAUTHORIZED, res });

		const { id } = req.params;
		const plan = new Plan(req.body, Number(id));

		this.productService
			.save(plan, req)
			.then(data => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	list(req: Request, res: Response) {
		const { id } = req.params;
		const options = new ReadOptionsModel(req.query);

		this.productService
			.read(options, Number(id))
			.then((data: any) => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	remove(req: Request, res: Response) {
		if (getTenancyByToken(req)) return ResponseHandle.onError({ message: 'User Unauthorized', status: UNAUTHORIZED, res });
		const { id } = req.params;

		this.productService
			.delete(Number(id))
			.then((data: any) => ResponseHandle.onSuccess({ res, data, status: data.status }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	private validRequest(req: Request) {
		const { name, limit, value } = req.body;

		const requireds = requiredFields([
			{ field: name, message: 'name' },
			{ field: limit, message: 'limit' },
			{ field: value, message: 'value' },
		]);

		notExistisOrError(requireds, requireds?.map(i => isRequired(i)).join('\n ') as string);
	}
}
