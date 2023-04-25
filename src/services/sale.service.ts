import { INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';

import { IProduct, ISale, IServiceOptions, IUnitModel, IUserModel } from 'src/repositories/types';
import { DatabaseService } from './abistract-database.service';
import { UnitService } from './unit.service';
import { UserService } from './user.service';
import { PaginationModel, ReadOptionsModel, SaleModel, SaleViewModel, UnitModel, UserModel, UserViewModel } from 'src/repositories/models';
import { FileEntity, Sale, Seller } from 'src/repositories/entities';
import { convertDataValues, deleteField, existsOrError } from 'src/utils';
import { SalePaymentService } from './sale-payment.service';
import { onLog } from 'src/core/handlers';

export class SaleService extends DatabaseService {
	constructor(
		options: IServiceOptions,
		private unitService: UnitService,
		private userService: UserService,
		private salePaymentService: SalePaymentService
	) {
		super(options);
	}

	async create(data: SaleModel) {
		try {
			const user = (await this.setUser(new UserModel(data.user as IUserModel))) as UserModel;
			existsOrError(Number(user?.id), user);
			const { id: userId, tenancyId, unit: unitUser } = user;
			onLog('new tenancy', tenancyId);
			existsOrError(Number(tenancyId), { message: 'Tenancy not found', err: tenancyId, status: NOT_FOUND });

			const unit = (await this.setUnit(
				new UnitModel({ ...unitUser, ...data.unit, tenancyId } as IUnitModel),
				tenancyId as number
			)) as UnitModel;
			existsOrError(Number(unit?.id), unit);
			onLog('unit to use', unit);
			const { id: unitId } = unit as UnitModel;

			const sellerId = (await this.setSeller(data.seller)) as number;
			onLog('seler Id form db', sellerId);
			existsOrError(Number(sellerId), sellerId);

			const paymentId = (await this.setPayment(data.paymentForm)) as number;
			onLog('payment Id form db', paymentId);
			existsOrError(Number(paymentId), paymentId);

			const toSave = new Sale({
				...data,
				userId: Number(userId),
				tenancyId: Number(tenancyId),
				sellerId,
				paymentId,
				unitId: Number(unitId),
			} as ISale);
			const [id] = await this.db('sales').insert(convertDataValues(toSave));
			existsOrError(Number(id), { message: 'Internal Error', err: id, status: INTERNAL_SERVER_ERROR });

			await this.setProduct(data.products, id);
			const contract = (await this.setFile(data.contract, 'saleId', id)) as FileEntity;

			existsOrError(Number(contract?.id), { message: 'Internal Error', err: contract, status: INTERNAL_SERVER_ERROR });

			return { message: 'Sale successifuly saved', data: { ...toSave, id, contract } };
		} catch (err) {
			return err;
		}
	}

	async update(data: SaleModel, id: number) {
		try {
			onLog('product to update', data);
			const fromDB = (await this.getSale(id)) as SaleViewModel;
			onLog('sale from db', fromDB);
			existsOrError(fromDB?.id, fromDB);
			const sellerId = (await this.setSeller(fromDB.seller || data.seller)) as number;
			const userId = Number(fromDB?.user.id);
			const unitId = Number(fromDB.unit.id);
			const tenancyId = Number(fromDB?.tenancyId);
			const paymentId = data.paymentForm ? await this.setPayment(data.paymentForm) : fromDB.payment.id;

			const toUpdate = new Sale({ ...fromDB, ...data, userId, unitId, sellerId, paymentId, tenancyId } as ISale);
			await this.db('sales').where({ id }).update(convertDataValues(toUpdate));

			const contract = data.contract ? await this.setFile(data.contract, 'saleId', id) : undefined;
			const products = data.products?.length ? await this.setProduct(data.products, id) : undefined;

			return { message: 'Sale successifuly updated', data: { ...toUpdate, contract, products } };
		} catch (err) {
			return err;
		}
	}

	async read(options: ReadOptionsModel, id?: number) {
		try {
			if (id) return this.getSale(id);
			const { page, limit, orderBy, order } = options;
			const total = await this.getCount('sales');
			const pagination = new PaginationModel({ page, limit, total });

			const fromDB = await this.db({ s: 'sales', u: 'units', us: 'users', sr: 'sellers', a: 'adresses' })
				.select(
					{
						id: 's.id',
						due_date: 's.due_date',
						value: 's.value',
						commission_value: 's.commission_value',
					},
					{ unit_name: 'u.name', cnpj: 'u.cnpj', phone: 'u.phone' },
					{
						street: 'a.street',
						number: 'a.number',
						complement: 'a.complement',
						district: 'a.district',
						city: 'a.city',
						uf: 'a.uf',
					},
					{ email: 'us.email' },
					{ seller: 'sr.seller' }
				)
				.whereRaw('u.id = s.unit_id')
				.andWhereRaw('a.unit_id = u.id')
				.andWhereRaw('us.id = s.user_id')
				.andWhereRaw('sr.id = s.seller_id')
				.limit(limit)
				.offset(page * limit - limit)
				.orderBy(orderBy || 'id', order || 'asc');

			existsOrError(Array.isArray(fromDB), { message: 'Internal Error', error: fromDB, status: INTERNAL_SERVER_ERROR });

			const raw = fromDB.map(i => {
				const { street, number, complement, district, city, uf } = i;

				i.address = `${street} ${number ? number + ', ' : ''}${complement + ' ' || ''}${district}, ${city} - ${uf}`;
				deleteField(i, 'street');
				deleteField(i, 'number');
				deleteField(i, 'complement');
				deleteField(i, 'district');
				deleteField(i, 'city');
				deleteField(i, 'uf');

				return convertDataValues(i, 'camel');
			});

			const data: any[] = [];

			for (const item of raw) {
				const payments = (await this.salePaymentService.read(item.id)) || [];

				data.push({ ...item, payments });
			}

			return { data, pagination };
		} catch (err) {
			return err;
		}
	}

	async getSale(id: number) {
		try {
			const fromDB = await this.db({ s: 'sales', p: 'payments', u: 'units', us: 'users', sr: 'sellers', a: 'adresses', f: 'files' })
				.select(
					{
						id: 's.id',
						due_date: 's.due_date',
						value: 's.value',
						commission_value: 's.commission_value',
						installments: 's.installments',
						description: 's.description',
						tenancy_id: 's.tenancy_id',
					},
					{ payment_id: 'p.id', form: 'p.form' },
					{ unit_id: 'u.id', unit_name: 'u.name', cnpj: 'u.cnpj', phone: 'u.phone' },
					{ user_id: 'us.id', first_name: 'us.first_name', last_name: 'us.last_name', email: 'us.email' },
					{ seller_id: 'sr.id', seller: 'sr.seller', cpf: 'sr.cpf' },
					{
						cep: 'a.cep',
						street: 'a.street',
						number: 'a.number',
						complement: 'a.complement',
						district: 'a.district',
						city: 'a.city',
						uf: 'a.uf',
					},
					{
						title: 'f.title',
						alt: 'f.alt',
						original_name: 'f.name',
						filename: 'f.filename',
						type: 'f.type',
						url: 'f.url',
					}
				)
				.where('s.id', id)
				.andWhereRaw('p.id = s.payment_id')
				.andWhereRaw('u.id = s.unit_id')
				.andWhereRaw('a.unit_id = u.id')
				.andWhereRaw('us.id = s.user_id')
				.andWhereRaw('sr.id = s.seller_id')
				.andWhereRaw('f.sale_id = s.id')
				.first();

			existsOrError(fromDB.id, { message: 'not found', status: NOT_FOUND });
			const raw = convertDataValues(fromDB, 'camel');
			const products = await this.getProducs(raw.id);
			const payments = (await this.salePaymentService.read(raw.id)) || [];
			const unit = { id: raw.unitId, name: raw.unitName, cnpj: raw.cnpj, phone: raw.phone };
			const user = { id: raw.userId, name: `${raw.firstName} ${raw.lastName}`, email: raw.email };

			onLog('product to use', products);

			return new SaleViewModel({
				...raw,
				products,
				unit,
				user,
				seller: { id: raw.sellerId, seller: raw.seller, cpf: raw.cpf },
				contract: { ...raw, name: raw.originalName },
				payments,
			});
		} catch (err) {
			return err;
		}
	}

	async delete(id: number) {
		try {
			const fromDB = await this.db('sales').where({ id }).first();

			existsOrError(Number(fromDB?.id), { message: 'sale not found or already deleted', status: NOT_FOUND });

			const clearProducts = await this.db('products_sales').where({ sale_id: fromDB.id }).del();
			existsOrError(Number(clearProducts), { message: 'internal error', status: INTERNAL_SERVER_ERROR, err: clearProducts });

			const deleteSale = await this.db('sales').where({ id }).del();
			existsOrError(Number(deleteSale), { message: 'internal error', status: INTERNAL_SERVER_ERROR, err: deleteSale });

			return { message: 'Sale successifuly deleted', data: convertDataValues(fromDB, 'camel') };
		} catch (err) {
			return err;
		}
	}

	private async setSeller(data: Seller) {
		try {
			const fromDB = await this.db('sellers').where('cpf', data.cpf).first();
			onLog('seller From db', fromDB);

			if (Number(fromDB?.id)) return Number(fromDB?.id);
			const [id] = await this.db('sellers').insert(convertDataValues(data));
			existsOrError(Number(id), { message: 'Internal Error', error: id, status: INTERNAL_SERVER_ERROR });

			return Number(id);
		} catch (err) {
			return err;
		}
	}

	private async setUser(data: UserModel) {
		try {
			const fromDB = (await this.userService.getUser(data.email)) as UserViewModel;
			onLog('user From db', fromDB);
			if (fromDB?.id) return fromDB as UserViewModel;

			const user = (await this.userService.create(data)) as any;
			onLog('save User', user);
			existsOrError(Number(user.data.id), user);

			return user.data as UserViewModel;
		} catch (err) {
			return err;
		}
	}

	private async setUnit(data: UnitModel, tenancyId: number) {
		try {
			const fromDB = data?.id
				? ((await this.unitService.getUnit(data.id as number, data.tenancyId || tenancyId)) as UnitModel)
				: ((await this.unitService.getUnit(data.name, data.tenancyId || tenancyId)) as UnitModel);

			if (fromDB?.id) return fromDB;

			const unit = (await this.unitService.create(data)) as any;
			onLog('save new unit', unit);

			existsOrError(unit?.data.id, unit);

			return unit.data as UnitModel;
		} catch (err) {
			return err;
		}
	}

	private async getProducs(id: number) {
		try {
			const res: any[] = [];

			const products = await this.db('products_sales').where('sale_id', id);
			existsOrError(Array.isArray(products), { message: 'Internal Error', error: products, status: INTERNAL_SERVER_ERROR });

			for (const product of products) {
				onLog('product to sale', product);
				const fromDB = await this.db('products').select('id', 'name', 'limit', 'value').where('id', product.product_id).first();

				existsOrError(fromDB?.id, { message: 'Internal Error', error: fromDB, status: INTERNAL_SERVER_ERROR });

				res.push(convertDataValues({ ...fromDB, productId: fromDB.id, amount: product.amount }, 'camel'));
			}

			return res;
		} catch (err) {
			return err;
		}
	}

	private async setProduct(products: IProduct[], saleId: number) {
		try {
			await this.db('products_sales').where('sale_id', saleId).del();

			for (const product of products) {
				const { productId, amount } = product;
				onLog('to save products', { productId, amount, saleId });

				const res = await this.db('products_sales').insert(convertDataValues({ productId, amount, saleId }));
				onLog('save products', res);
			}
		} catch (err) {
			return err;
		}
	}
}
