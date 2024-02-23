import { onError } from './../core/handlers/log.handler';
import { Request } from 'express';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';
import { getUserLogData, onLog } from 'src/core/handlers';

import { Unit } from 'src/repositories/entities';
import { ReadOptionsModel, UnitModel } from 'src/repositories/models';
import { IServiceOptions, IUnit, IUnitProduct } from 'src/repositories/types';
import { convertBlobToString, convertDataValues, existsOrError, notExistisOrError } from 'src/utils';
import { DatabaseService } from './abistract-database.service';

export class UnitService extends DatabaseService {
	constructor(options: IServiceOptions) {
		super(options);
	}

	async create(data: UnitModel, req: Request) {
		try {
			onLog('unit to save', data);
			const unit = new Unit({ ...data, active: true } as IUnit);
			const [id] = await this.db('units').insert(convertDataValues(unit));

			existsOrError(Number(id), { message: 'Internal error', error: id, status: INTERNAL_SERVER_ERROR });

			if (data.products) {
				const res = await this.setProducts(data.products, id);
				onLog('response to save prducts unit', res);
			}
			await this.setAddress({ ...data.address, unitId: id }, 'unitId', Number(id));

			await this.userLogService.create(getUserLogData(req, 'units', id, 'salvar'));
			return { message: 'Unit created successfully.', unit: { ...data, ...unit, id } };
		} catch (err) {
			return err;
		}
	}

	async update(data: UnitModel, id: number, req: Request) {
		try {
			const unit = (await this.getUnit(id, data.tenancyId)) as UnitModel;

			existsOrError(unit?.id, unit);

			const toSave = new Unit({ ...unit, ...data, tenancyId: unit.tenancyId });
			onLog('unit to save', toSave);

			if (data?.products?.length) {
				await this.db('units_products').where('unit_id', id).del();
				await this.setProducts(data.products, id);
			}

			await this.db('units').where({ id }).andWhere('tenancy_id', unit.tenancyId).update(convertDataValues(toSave));
			if (data.address) await this.setAddress({ ...data.address, unitId: unit.id }, 'unitId', unit.id);

			await this.userLogService.create(getUserLogData(req, 'units', id, 'atualizar'));
			return { message: 'Unit updated successfully.', unit: { ...unit, ...data } };
		} catch (err) {
			return err;
		}
	}

	async read(options: ReadOptionsModel, id?: number) {
		const { tenancyId } = options;

		try {
			existsOrError(tenancyId, { message: tenancyId, status: BAD_REQUEST });
		} catch (err) {
			onError('unit error', err);
			return err;
		}

		if (id) return this.getUnit(id, tenancyId as number);

		return this.db('units')
			.select('id', 'name', 'description')
			.where('tenancy_id', tenancyId)
			.then(res => {
				existsOrError(Array.isArray(res), { message: 'Internal Error', error: res, status: INTERNAL_SERVER_ERROR });
				return res.map(i => {
					i.description = convertBlobToString(i.description);
					return convertDataValues(i, 'camel');
				});
			})
			.catch(err => err);
	}

	async getUnit(filter: number | string, tenancyId: number) {
		try {
			const fields = [
				{
					id: 'u.id',
					name: 'u.name',
					description: 'u.description',
					cnpj: 'u.cnpj',
					phone: 'u.phone',
					active: 'u.active',
					tenancy_id: 'u.tenancy_id',
				},
				{
					cep: 'a.cep',
					street: 'a.street',
					number: 'a.number',
					complement: 'a.complement',
					district: 'a.district',
					city: 'a.city',
					uf: 'a.uf',
				},
			];
			const tables = { u: 'units', a: 'adresses' };
			const unit =
				typeof filter === 'number'
					? await this.db(tables)
							.select(...fields)
							.where('u.id', filter)
							.andWhere('u.tenancy_id', tenancyId)
							.andWhereRaw('a.unit_id = u.id')
							.first()
					: await this.db(tables)
							.select(...fields)
							.where('u.name', filter)
							.andWhere('u.tenancy_id', tenancyId)
							.andWhereRaw('a.unit_id = u.id')
							.first();

			existsOrError(unit?.id, { message: 'unit not found', status: NOT_FOUND });
			const raw = convertDataValues(unit, 'camel');
			const products = await this.getProducts(raw.id);

			return new UnitModel({
				...raw,
				products,
				address: {
					cep: raw.cep,
					street: raw.street,
					number: raw.number,
					complement: raw.complement,
					district: raw.district,
					city: raw.city,
					uf: raw.uf,
				},
			});
		} catch (err) {
			return err;
		}
	}

	async desactve(id: number, tenancyId: number, req: Request) {
		try {
			const unit = (await this.getUnit(id, tenancyId)) as UnitModel;

			existsOrError(unit?.id, { message: 'Unit not found', status: NOT_FOUND });
			existsOrError(unit.active, { message: 'Unit already desactved.', status: BAD_REQUEST });

			const toDisabled = new Unit({ ...unit, active: false });
			onLog('unit to desactved', toDisabled);
			await this.db('units').where({ id }).andWhere('tenancy_id', tenancyId).update(convertDataValues(toDisabled));
			await this.userLogService.create(getUserLogData(req, 'units', id, 'desativar'));

			return { message: 'Unit successfully desactved.', unit: { ...unit, active: false } };
		} catch (err) {
			return err;
		}
	}

	private async getProducts(unitId: number) {
		try {
			const unitsProducts = await this.db('units_products').where('unit_id', unitId);
			existsOrError(Array.isArray(unitsProducts), {
				message: 'Internal Error',
				err: unitsProducts,
				status: INTERNAL_SERVER_ERROR,
			});
			const res: any[] = [];

			for (const data of unitsProducts) {
				const { product_id: id, amount } = data;
				const product = await this.db('products').select('id', 'name', 'limit', 'plan').where({ id }).first();

				existsOrError(product?.id, { message: 'Not found', status: NOT_FOUND });

				if (product?.id) res.push(convertDataValues({ ...product, amount }, 'camel'));
			}

			return res;
		} catch (err) {
			return err;
		}
	}

	private async setProducts(data: IUnitProduct[], unitId: number) {
		try {
			for (const product of data) {
				const { id: productId, amount } = product;
				const fromDB = await this.db('units_products').where('product_id', productId).andWhere('unit_id', unitId).first();

				notExistisOrError(fromDB?.severity === 'ERROR', {
					message: 'Internal Error',
					err: fromDB,
					status: INTERNAL_SERVER_ERROR,
				});

				if (fromDB?.unit_id && fromDB?.product_id) {
					await this.db('units_products')
						.update(convertDataValues({ amount, productId, unitId }))
						.where('product_id', productId)
						.andWhere('unit_id', unitId);
				} else {
					const toSave = { productId, unitId, amount };
					onLog('unit Product to save', toSave);
					const save = await this.db('units_products').insert(convertDataValues(toSave));

					onLog('unit product saved', save);
				}
			}
		} catch (err) {
			return err;
		}
	}
}
