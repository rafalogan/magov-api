import { BAD_REQUEST } from 'http-status';
import { Request, Response } from 'express';

import { Controller } from 'src/core/controllers';
import { CommentService } from 'src/services';
import { ResponseHandle, getTenancyByToken } from 'src/core/handlers';
import { existsOrError, isRequired, notExistisOrError, requiredFields } from 'src/utils';
import { Comment } from 'src/repositories/entities';
import { ReadOptionsModel } from 'src/repositories/models';

export class CommentController extends Controller {
	constructor(private commentService: CommentService) {
		super();
	}

	save(req: Request, res: Response) {
		try {
			this.validateRequest(req);
		} catch (err) {
			return ResponseHandle.onError({ res, err });
		}

		const tenancyId = getTenancyByToken(req) || req.body.tenancyId;
		const comment = new Comment({ ...req.body, tenancyId });

		this.commentService
			.save(comment, req)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	edit(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = getTenancyByToken(req) || Number(req.body.tenancyId || req.query.tenancyId);
		const comment = new Comment({ ...req.body, tenancyId }, Number(id));

		this.commentService
			.save(comment, req)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	list(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = getTenancyByToken(req) || Number(req.query.tenancyId);
		const options = new ReadOptionsModel({ ...req.query, tenancyId });

		this.commentService
			.read(options, Number(id))
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	remove(req: Request, res: Response) {
		const { id } = req.params;
		const tenancyId = getTenancyByToken(req) || Number(req.query.tenancyId);

		try {
			existsOrError(tenancyId, { message: isRequired('query tenancyId'), status: BAD_REQUEST });
		} catch (err) {
			return ResponseHandle.onError({ res, err });
		}

		this.commentService
			.disabled(Number(id), tenancyId)
			.then(data => ResponseHandle.onSuccess({ res, data }))
			.catch(err => ResponseHandle.onError({ res, err }));
	}

	private validateRequest(req: Request) {
		const { comment, userId, taskId } = req.body;
		const tenancyId = getTenancyByToken(req) || Number(req.body.tenancyId);

		const requireds = requiredFields([
			{ field: comment, message: isRequired('comment') },
			{ field: userId, message: isRequired('userId') },
			{ field: taskId, message: isRequired('taskId') },
			{ field: tenancyId, message: isRequired('tenancyId') },
		]);

		notExistisOrError(requireds, { message: requireds?.join('\n '), status: BAD_REQUEST });
	}
}
