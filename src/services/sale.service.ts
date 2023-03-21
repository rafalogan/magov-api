import { IProduct, ISale, IServiceOptions } from 'src/repositories/types';
import { DatabaseService } from './abistract-database.service';
import { UnitService } from './unit.service';
import { UserService } from './user.service';
import { PaginationModel, ReadOptionsModel, SaleModel, SaleViewModel, UnitModel, UserModel, UserViewModel } from 'src/repositories/models';
import { FileEntity, Sale, Seller } from 'src/repositories/entities';
import { convertDataValues, deleteField, existsOrError } from 'src/utils';
import { INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status';
import { error } from 'console';

export class SaleService extends DatabaseService {
	constructor(options: IServiceOptions, private unitService: UnitService, private userService: UserService) {
		super(options);
	}

	async create(data: SaleModel) {
		try {
			const user = (await this.setUser(data.user as UserModel)) as UserModel;
			existsOrError(Number(user.id), user);
			const { id: userId, tenancyId } = user;

			const unit = (await this.setUnit({ ...data.unit, tenancyId } as UnitModel)) as UnitModel;
			existsOrError(Number(unit.id), unit);
			const { id: unitId } = unit;

			const sellerId = (await this.setSeller(data.seller)) as number;
			existsOrError(Number(sellerId), sellerId);

			const paymentId = (await this.setPayment(data.paymentForm)) as number;
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
			const fromDB = (await this.getSale(id)) as SaleViewModel;
			existsOrError(fromDB?.id, fromDB);
			const sellerId = (await this.setSeller(fromDB.seller || data.seller)) as number;
			const unit = (await this.setUnit({ ...data.unit, tenancyId: fromDB.tenancyId })) as UnitModel;
			const userId = Number(fromDB?.user.id);
			const unitId = Number(unit.id);
			const paymentId = data.paymentForm ? await this.setPayment(data.paymentForm) : fromDB.payment.id;

			const toUpdate = new Sale({ ...fromDB, ...data, userId, unitId, sellerId, paymentId } as ISale);
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

			const fromDB = await this.db({ s: 'sales', u: 'units', us: 'users', sr: 'seller', a: 'adresses' })
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
					{ seller: 'u.seller' }
				)
				.limit(limit)
				.offset(page * limit - limit)
				.orderBy(orderBy || 'id', order || 'asc');

			existsOrError(Array.isArray(fromDB), { message: 'Internal Error', error: fromDB, status: INTERNAL_SERVER_ERROR });

			const data = fromDB.map(i => {
				const { street, number, complement, district, city, uf } = i;

				i.address = `${street} ${number ? number + ',' : ''} ${complement || ''} ${district}, ${city} - ${uf}`;
				deleteField(i, 'street');
				deleteField(i, 'number');
				deleteField(i, 'complement');
				deleteField(i, 'district');
				deleteField(i, 'city');
				deleteField(i, 'uf');

				return convertDataValues(i, 'camel');
			});

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
				.andWhereRaw('us.id = s.user_id')
				.andWhereRaw('sr.id = s.seller_id')
				.andWhereRaw('a.unit_id = s.unit_id')
				.andWhereRaw('f.sale_id = s.id')
				.first();

			existsOrError(fromDB.id, { message: 'not found', status: NOT_FOUND });
			const raw = convertDataValues(fromDB, 'camel');
			const products = await this.getProducs(raw.id);

			return new SaleViewModel({
				...raw,
				products,
				unit: { ...raw, id: raw.unitId, name: raw.unitName },
				user: { ...raw, id: raw.userId, name: `${raw.firstName} ${raw.lastName}` },
				saller: { ...raw, id: raw.sellerId },
				contract: { ...raw, name: raw.originalName },
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

	async setSeller(data: Seller) {
		try {
			const fromDB = await this.db('sellers').where('cpf', data.cpf).first();

			if (Number(fromDB?.id)) return Number(fromDB?.id);
			const [id] = await this.db('sellers').insert(convertDataValues(data));
			existsOrError(Number(id), { message: 'Internal Error', error: id, status: INTERNAL_SERVER_ERROR });

			return Number(id);
		} catch (err) {
			return err;
		}
	}

	async setUser(data: UserModel) {
		try {
			const fromDB = (await this.userService.getUser(data.email)) as UserViewModel;
			if (fromDB?.id) return fromDB as UserViewModel;

			const user = (await this.userService.create(data)) as any;
			existsOrError(Number(user.data.id), user);

			return user.data as UserViewModel;
		} catch (err) {
			return err;
		}
	}

	async setUnit(data: UnitModel) {
		try {
			const fromDB = (await this.unitService.getUnit(Number(data?.id), data.tenancyId)) as UnitModel;
			if (fromDB?.id) return fromDB;

			const unit = (await this.unitService.create(data)) as any;

			existsOrError(unit.data.id, unit);

			return unit.data as UnitModel;
		} catch (err) {
			return err;
		}
	}

	private async getProducs(id: number) {
		return this.db({ ps: 'products_sales', p: 'products' })
			.select(
				{ amaount: 'ps.amaount' },
				{
					id: 'p.id',
					name: 'p.name',
					limit: 'p.limit',
					value: 'p.value',
				}
			)
			.where('ps.sale_id', id)
			.andWhereRaw('p.id = ps.product_id')
			.then(res => {
				try {
					existsOrError(Array.isArray(res), { message: 'Internal Error', error: res, status: INTERNAL_SERVER_ERROR });
				} catch (err) {
					return err;
				}

				return res.map(i => convertDataValues(i, 'camel'));
			});
	}

	private async setProduct(products: IProduct[], saleId: number) {
		try {
			await this.db('products_sales').where('sale_id', saleId).del();
			for (const product of products) {
				await this.db('products_sales').insert(convertDataValues({ ...product, saleId }));
			}
		} catch (err) {
			return err;
		}
	}
}
