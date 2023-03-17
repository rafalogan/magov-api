import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';

import { ICommentModel, IServiceOptions } from 'src/repositories/types';
import { DatabaseService } from './abistract-database.service';
import { Comment } from 'src/repositories/entities';
import { CommentModel, PaginationModel, ReadOptionsModel } from 'src/repositories/models';
import { convertDataValues, deleteField, existsOrError, isRequired } from 'src/utils';
import { onLog } from 'src/core/handlers';

export class CommentService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: Comment) {
		deleteField(data, 'active');
		return this.db('comments')
			.insert(convertDataValues(data))
			.then(([id]) => {
				existsOrError(Number(id), { message: 'Internal error', error: id, status: INTERNAL_SERVER_ERROR });
				return { message: 'Comment create with success', data: { ...data, id } };
			})
			.catch(err => err);
	}

	async update(data: Comment, id: number) {
		try {
			const fromDB = (await this.getComment(id, data.tenancyId)) as CommentModel;

			existsOrError(fromDB.id, { message: 'Not Found', status: NOT_FOUND });
			const toUpdate = new Comment({ ...fromDB, ...data, tenancyId: fromDB.tenancyId }, id);
			await this.db('comments').where({ id }).andWhere('tenancy_id', fromDB.tenancyId).update(convertDataValues(data));

			return { message: 'Comment updated with success', data: toUpdate };
		} catch (err) {
			return err;
		}
	}

	async read(options: ReadOptionsModel, id?: number) {
		const { tenancyId } = options;

		existsOrError(tenancyId, { message: isRequired('tenancyId'), status: BAD_REQUEST });
		if (id) return this.getComment(id, tenancyId as number);

		return this.getComments(options);
	}

	async getComments(options: ReadOptionsModel) {
		try {
			const { page, limit, taskId, tenancyId, order, orderBy } = options;
			const total = !taskId ? await this.getCount('comments', tenancyId) : null;

			const tables = { c: 'comments', u: 'users' };
			const subTables = { sc: 'comments', su: 'users' };
			const fields = [
				{
					id: 'c.id',
					comment: 'c.comment',
					action: 'c.active',
					task_id: 'c.task_id',
					parent_id: 'c.parent_id',
					tenancy_id: 'c.tenancy_id',
				},
				{ user_id: 'u.id', first_name: 'u.first_name', last_name: 'u.last_name', email: 'u.email' },
			];
			const subFields = [
				{
					id: 'sc.id',
					comment: 'sc.comment',
					action: 'sc.active',
					task_id: 'sc.task_id',
					parent_id: 'sc.parent_id',
					tenancy_id: 'sc.tenancy_id',
				},
				{ user_id: 'su.id', first_name: 'su.first_name', last_name: 'su.last_name', email: 'su.email' },
			];
			const data = ['id', 'comment', 'active', 'task_id', 'parent_id', 'tenancy_id', 'user_id', 'first_name', 'last_name', 'email'];

			const fromDB = taskId
				? await this.db
						.withRecursive('subcommentaries', data, qb =>
							qb
								.select(...fields)
								.from(tables)
								.where('c.tenancy_id', tenancyId)
								.andWhere('c.task_id', taskId)
								.andWhereRaw('u.id = c.user_id')
								.unionAll(qb =>
									qb
										.select(...subFields)
										.from({ ...subTables, sub: 'subcommentaries' })
										.whereRaw('sc.parent_id = sub.id')
										.andWhereRaw('su.id = sc.user_id')
								)
						)
						.select(...data)
						.from('subcommentaries')
				: await this.db
						.withRecursive('subcommentaries', data, qb =>
							qb
								.select(...fields)
								.from(tables)
								.where('c.tenancy_id', tenancyId)
								.andWhereRaw('u.id = c.user_id')
								.unionAll(qb =>
									qb
										.select(...subFields)
										.from({ ...subTables, sub: 'subcommentaries' })
										.whereRaw('sc.parent_id = sub.id')
										.andWhereRaw('su.id = sc.user_id')
								)
						)
						.select(...data)
						.from('subcommentaries')
						.limit(limit)
						.offset(page * limit - limit)
						.orderBy(orderBy || 'id', order || 'asc');

			existsOrError(Array.isArray(fromDB), { message: 'Comments Not Found' });
			const raw = fromDB.map(i => convertDataValues(i, 'camel'));
			onLog('comments raw', raw);

			const res = this.setComments(raw).map(i => new CommentModel(i));
			const pagination = !taskId ? new PaginationModel({ page, limit, total }) : null;

			return taskId ? res : { data: res, pagination };
		} catch (err) {
			return err;
		}
	}

	async getComment(value: number, tenancyId: number) {
		try {
			const tables = { c: 'comments', u: 'users' };
			const fields = [
				{
					id: 'c.id',
					comment: 'c.comment',
					active: 'c.active',
					task_id: 'c.task_id',
					parent_id: 'c.parent_id',
					tenancy_id: 'c.tenancy_id',
				},
				{ user_id: 'u.id', first_name: 'u.first_name', last_name: 'u.last_name', email: 'u.email' },
			];
			const fromDB = await this.db
				.withRecursive(
					'subcommentaries',
					['id', 'comment', 'active', 'task_id', 'parent_id', 'tenancy_id', 'user_id', 'first_name', 'last_name', 'email'],
					qb =>
						qb
							.select(...fields)
							.from(tables)
							.where('c.tenancy_id', tenancyId)
							.andWhereRaw('u.id = c.user_id')
							.andWhere('c.id', value)
							.unionAll(qb =>
								qb
									.select(
										{
											id: 'sc.id',
											comment: 'sc.comment',
											active: 'sc.active',
											task_id: 'sc.task_id',
											parent_id: 'sc.parent_id',
											tenancy_id: 'sc.tenancy_id',
										},
										{ user_id: 'su.id', first_name: 'su.first_name', last_name: 'su.last_name', email: 'su.email' }
									)
									.from({ sc: 'comments', su: 'users', sub: 'subcommentaries' })
									.whereRaw('sc.parent_id = sub.id')
									.andWhereRaw('su.id = sc.user_id')
							)
				)
				.select('id', 'comment', 'active', 'task_id', 'parent_id', 'tenancy_id', 'user_id', 'first_name', 'last_name', 'email')
				.from('subcommentaries');

			existsOrError(Array.isArray(fromDB), { message: 'Comment Not Found', status: NOT_FOUND });
			const raw = fromDB.map(i => convertDataValues(i, 'camel'));

			onLog('data raw', raw);
			const res = this.setComments(raw)[0];
			return new CommentModel(res);
		} catch (err) {
			return err;
		}
	}

	async disabled(id: number, tenancyId: number) {
		try {
			const fromDB = (await this.getComment(id, tenancyId)) as CommentModel;
			onLog('comment for disabled', fromDB);
			existsOrError(fromDB?.id, { message: 'Comment not found', status: NOT_FOUND });

			if (fromDB?.comments) {
				for (const sub of fromDB.comments) {
					const toDisabled = new Comment({ ...sub, userId: sub.user.id, active: false });
					await this.db('comments')
						.where({ id: toDisabled.id })
						.andWhere('tenancy_id', toDisabled.tenancyId)
						.update(convertDataValues(toDisabled));
				}
			}

			const toDesabled = new Comment({ ...fromDB, userId: fromDB.user.id });
			await this.db('comments').where({ id }).andWhere('tenancy_id', tenancyId).update(convertDataValues(toDesabled));

			return {
				message: 'Comment is disabled with success',
				data: { ...fromDB, active: false, comments: fromDB.comments?.map(i => ({ ...i, active: false })) },
			};
		} catch (err) {
			return err;
		}
	}

	private setComments(value: ICommentModel[], parentId?: number): any {
		if (parentId) {
			return value
				.filter(i => i.parentId === parentId)
				.map(i => {
					i.comments = this.setComments(value, i.id);
					return i;
				});
		}

		if (value.filter(i => !i.parentId).length !== 0) {
			return value
				.filter(i => !i.parentId)
				.map(i => {
					i.comments = this.setComments(value, i.id);
					return i;
				});
		}

		return value.length ? [{ ...value[0], comments: this.setComments(value, value[0].id) }] : [];
	}
}
