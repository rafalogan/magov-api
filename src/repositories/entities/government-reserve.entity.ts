import { IGovernmentReserve, IGovernmentRevenueReserve } from 'src/repositories/types';
import { convertToDate } from 'src/utils';

export class GovernmentReserve {
	id: number;
	reserves: IGovernmentRevenueReserve[];

	constructor(data: IGovernmentReserve, id?: number) {
		this.id = Number(id || data.id);
		this.reserves = this.setReserves(data.reserves);
	}

	private setReserves(data: IGovernmentRevenueReserve[]): IGovernmentRevenueReserve[] {
		return data?.map(i => ({
			...i,
			id: Number(i.id),
			date: convertToDate(i?.date || new Date()),
			value: i.value * 100,
			revenueValue: i.revenueValue * 100,
		}));
	}
}
