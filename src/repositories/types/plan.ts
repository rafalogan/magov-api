export interface IPlan {
	id: number;
	name: string;
	description?: Blob;
	userLimit?: number;
	unitaryValue: number;
}
