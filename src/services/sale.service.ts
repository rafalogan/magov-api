import { INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';

import { ISale, ISaleProduct, IServiceOptions } from 'src/repositories/types';
import { DatabaseService } from './abistract-database.service';
import { UserService } from './user.service';
import { PaginationModel, ReadOptionsModel, SaleModel, SaleViewModel } from 'src/repositories/models';
import { Sale, Seller } from 'src/repositories/entities';
import { convertDataValues, deleteField, existsOrError } from 'src/utils';
import { SalePaymentService } from './sale-payment.service';
import { onLog } from 'src/core/handlers';

export class SaleService extends DatabaseService {
	constructor(options: IServiceOptions, private userService: UserService, private salePaymentService: SalePaymentService) {
		super(options);
	}

	async create(data: SaleModel) {
		try {
			onLog('Sale to save', data);
			const sellerId = (await this.setSeller(new Seller({ ...data }))) as number;
			existsOrError(Number(sellerId), { message: 'Internal Error', err: sellerId, status: INTERNAL_SERVER_ERROR });

			const paymentId = (await this.setPayment(data.paymentForm)) as number;
			existsOrError(Number(paymentId), { message: 'Internal Error', err: paymentId, status: INTERNAL_SERVER_ERROR });

			const toSave = new Sale({ ...data, commissionValue: data.commission, sellerId, paymentId, description: data.description as string });
			const [id] = await this.db('sales').insert(convertDataValues(toSave));
			existsOrError(Number(id), { message: 'Internal Error', err: id, status: INTERNAL_SERVER_ERROR });

			const plans = data.products.filter(p => p.plan);
			if (plans.length) await this.userService.setTenancy(data.tenancyId, plans);

			await this.setUnitProducts(data.products, data.unitId);

			await this.setProducts(data.products, id);
			await this.setFile(data.contract, 'saleId', id);

			return { message: 'Sale successifuly saved', data: { ...data, id } };
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

			if (data.products?.length) {
				const plans = data.products.filter(p => p.plan);
				if (plans.length) await this.userService.setTenancy(tenancyId, plans);

				await this.setUnitProducts(data.products, unitId);
				await this.setUnitProducts(data.products, id);
			}

			return { message: 'Sale successifuly updated', data: { ...toUpdate, contract } };
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

			const fromDB = await this.db({ s: 'sales', u: 'units', us: 'users', sr: 'sellers', a: 'adresses', f: 'files' })
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
					{ seller: 'sr.seller' },
					{ contract: 'f.url' }
				)
				.whereRaw('u.id = s.unit_id')
				.andWhereRaw('a.unit_id = u.id')
				.andWhereRaw('us.id = s.user_id')
				.andWhereRaw('sr.id = s.seller_id')
				.andWhereRaw('f.sale_id = s.id')
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
			const fromDB = await this.db({
				s: 'sales',
				p: 'payments',
				u: 'units',
				us: 'users',
				sr: 'sellers',
				a: 'adresses',
				f: 'files',
			})
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
			existsOrError(Number(clearProducts), {
				message: 'internal error',
				status: INTERNAL_SERVER_ERROR,
				err: clearProducts,
			});

			const deleteSale = await this.db('sales').where({ id }).del();
			existsOrError(Number(deleteSale), { message: 'internal error', status: INTERNAL_SERVER_ERROR, err: deleteSale });

			return { message: 'Sale successifuly deleted', data: convertDataValues(fromDB, 'camel') };
		} catch (err) {
			return err;
		}
	}

	private async getPaymentsBySale(saleId: number) {
		try {
			const fromDB = await this.db('sales_payments').where('sale_id', saleId);
			existsOrError(Array.isArray(fromDB), { message: 'Internal Error', err: fromDB, status: INTERNAL_SERVER_ERROR });
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

	private async setUnitProducts(data: ISaleProduct[], unitId: number) {
		try {
			for (const product of data) {
				const { id: productId, amount } = product;
				const fromDB = await this.db('units_products').where('unit_id', unitId).andWhere('product_id', productId).first();

				if (fromDB?.unit_id) {
					const toUpdate = { unitId, productId, amount: Number(fromDB.amount) + amount };
					await this.db('units_products').update(convertDataValues(toUpdate)).where('unit_id', unitId).andWhere('product_id', productId);
				} else {
					const toSave = { unitId, productId, amount };
					await this.db('units_products').insert(convertDataValues(toSave));
				}
			}
		} catch (err) {
			return err;
		}
	}

	private async getProducs(id: number) {
		try {
			const res: any[] = [];

			const products = await this.db('products_sales').where('sale_id', id);
			existsOrError(Array.isArray(products), {
				message: 'Internal Error',
				error: products,
				status: INTERNAL_SERVER_ERROR,
			});

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

	private async setProducts(products: ISaleProduct[], saleId: number) {
		try {
			for (const product of products) {
				const { id: productId, amount, value: unitaryValue } = product;
				await this.db('products_sales').where('sale_id', saleId).andWhere('product_id', productId).del();

				onLog('to save products', { productId, amount, saleId });

				const res = await this.db('products_sales').insert(convertDataValues({ productId, amount, saleId, unitaryValue }));
				onLog('save products', res);
			}
		} catch (err) {
			return err;
		}
	}
}
