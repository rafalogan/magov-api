export interface IPlan {
	id?: number;
	name: string;
	description?: Blob | string;
	limit?: number;
	value: number;
	active: boolean;
	typeId: number;
	type: string;
}

export interface IProduct extends IPlan {
	productId?: number;
	amount?: number;
}
