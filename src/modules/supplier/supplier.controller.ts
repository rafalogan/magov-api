import {} from 'http-status';
import { Request, Response } from 'express';
import { SupplierService } from 'src/services';
import { ResponseHandle, getTenancyByToken, onLog } from 'src/core/handlers';
import { isRequired, notExistisOrError, requiredFields } from 'src/utils';
import { Supplier } from 'src/repositories/entities';
import { ReadOptionsModel } from 'src/repositories/models';

export class SupplierController {
	constructor(private supplierService: SupplierService) {}

	save(req: Request, res: Response) {
		try {
			this.verifyRequest(req);
		} catch (err) {
			return ResponseHandle.onError({ res, err });
		}
		const tenancyId = getTenancyByToken(req) || Number(req.body.tenancyId);
		const toSave = new Supplier({ ...req.body, tenancyId });

		this.supplierService
			.save(toSave, req)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	edit(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = getTenancyByToken(req) || Number(req.body.tenancyId);
		const toUpdate = new Supplier({ ...req.body, tenancyId }, Number(id));

		this.supplierService
			.save(toUpdate, req)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	list(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = getTenancyByToken(req) || Number(req.query.tenancyId);
		const options = new ReadOptionsModel({ ...req.query, tenancyId });

		onLog('Read options', options);

		this.supplierService
			.read(options, Number(id))
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	private verifyRequest(req: Request) {
		const { name } = req.body;
		const tenancyId = getTenancyByToken(req) || Number(req.body.tenancyId);

		const requireds = requiredFields([
			{ field: name, message: isRequired('name') },
			{ field: tenancyId, message: isRequired('tenancyId') },
		]);

		notExistisOrError(requireds, { message: requireds?.join('\n ') });
	}
}
